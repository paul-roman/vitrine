import * as path from 'path';
import * as fs from 'fs-extra';
import { parseString as parseXmlString } from 'xml2js';
import * as Registry from 'winreg';
import * as glob from 'glob';

import { GameSource, PotentialGame } from '../../models/PotentialGame';
import { PlayableGame } from '../../models/PlayableGame';
import { GamesCollection } from '../../models/GamesCollection';
import { getIgdbWrapperSearcher } from '../api/IgdbWrapper';
import { getEnvFolder, uuidV5 } from '../../models/env';
import { spatStr } from '../helpers';

class OriginGamesCrawler {
	private regDetails: any[];
	private potentialGames: PotentialGame[];
	private playableGames: PlayableGame[];
	private gamesFolder: string;
	private callback: Function;

	public constructor(private originConfig: any, playableGames?: PlayableGame[]) {
		this.potentialGames = [];
		this.regDetails = [];
		this.playableGames = (playableGames) ? (playableGames) : ([]);
	}

	public search(callback: Function) {
		this.callback = callback;

		let xmlPath: string = path.resolve(this.originConfig.configFile.replace('%appdata%', process.env.APPDATA));
		parseXmlString(fs.readFileSync(xmlPath).toString(), (error: Error, result: any) => {
			if (error)
				this.callback(error, null);

			this.gamesFolder = result.Settings.Setting[0].$.value;
			this.parseRegistry();
		});
	}

	private parseRegistry() {
		let regKey = new Registry({
			hive: Registry[this.originConfig.regHive],
			key: this.originConfig.regKey
		});
		regKey.keys((error: Error, items: Winreg.Registry[]) => {
			if (error)
				this.callback(error, null);

			let counter: number = 0;
			items.forEach((key: Winreg.Registry) => {
				key.values((error: Error, values: Winreg.RegistryItem[]) => {
					if (error)
						this.callback(error, null);

					this.regDetails.push({
						path: values[1].value,
						exe: values[5].value
					});
					counter++;
					if (counter === items.length)
						glob(`${this.gamesFolder}*`, this.parseFolder.bind(this));
				});
			});
		});
	}

	private parseFolder(error: Error, files: string[]) {
		if (error)
			this.callback(error, null);

		if (!files.length) {
			let potentialGames: GamesCollection<PotentialGame> = new GamesCollection();
			this.callback(null, potentialGames);
			return;
		}
		let counter: number = 0;
		files.forEach((gameFolder: string) => {
			let gameName: string = gameFolder.split('/').pop();

			if (this.isGameAlreadyAdded(gameName)) {
				counter++;
				if (counter === files.length) {
					let potentialGames: GamesCollection<PotentialGame> = new GamesCollection();
					potentialGames.games = this.potentialGames;
					this.callback(null, potentialGames);
				}
				return;
			}
			for (let playableGame of this.playableGames) {
				if (spatStr(gameName) === spatStr(playableGame.name)) {
					counter++;
					if (counter === files.length) {
						let potentialGames: GamesCollection<PotentialGame> = new GamesCollection();
						potentialGames.games = this.potentialGames;
						this.callback(null, potentialGames);
					}
					return;
				}
			}

			this.getRegExe(gameFolder, (error: Error, gamePath: string) => {
				if (error)
					this.callback(error, null);

				getIgdbWrapperSearcher(gameName, 1).then((game: any) => {
					game = game[0];
					delete game.name;
					let potentialGame: PotentialGame = new PotentialGame(gameName, game);
					potentialGame.source = GameSource.ORIGIN;
					potentialGame.commandLine = [
						path.resolve(gamePath)
					];
					this.potentialGames.push(potentialGame);
					counter++;
					if (counter === files.length) {
						let potentialGames: GamesCollection<PotentialGame> = new GamesCollection();
						potentialGames.games = this.potentialGames;
						this.callback(null, potentialGames);
					}
				}).catch((error: Error) => {
					this.callback(error, null);
				});
			});
		});
	}

	private getRegExe(gamePath: string, callback: Function) {
		let counter: number = 0;
		let found: boolean = false;
		this.regDetails.forEach((regDetail: any) => {
			if (path.resolve(gamePath) === path.resolve(regDetail.path)) {
				callback(null, regDetail.exe);
				found = true;
			}
			counter++;
			if (!found && counter === this.regDetails.length)
				callback(new Error('Registry not matching.'), null);
		});
	}

	private isGameAlreadyAdded(name: string): boolean {
		let gameUuid: string = uuidV5(name);

		let gameDirectory = path.resolve(getEnvFolder('games'), gameUuid);
		let configFilePath = path.resolve(gameDirectory, 'config.json');

		return fs.existsSync(configFilePath);
	}
}

export function getOriginCrawler(originConfig: any, playableGames?: PlayableGame[]): Promise<any> {
	return new Promise((resolve, reject) => {
		new OriginGamesCrawler(originConfig, playableGames).search((error: Error, potentialGames: GamesCollection<PotentialGame>) => {
			if (error)
				reject(error);
			else
				resolve(potentialGames);
		});
	});
}
