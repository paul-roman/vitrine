import * as path from 'path';
import * as fs from 'fs';
import * as glob from 'glob';

import { uuidV5 } from '../helpers';
import { AcfParser } from '../api/AcfParser';
import { PotentialSteamGame } from './PotentialSteamGame';
import { IgdbWrapper } from '../api/IgdbWrapper';

export class SteamGamesCrawler {
	private configFilePath: string;
	private configFile: any;
	private manifestRegEx: string;
	private potentialGames: PotentialSteamGame[];
	private currentCallback: Function;

	constructor() {
		this.configFilePath = path.join('config/steam.json');
		this.configFile = JSON.parse(fs.readFileSync(this.configFilePath).toString());
		this.manifestRegEx = 'appmanifest_*.acf';
		this.potentialGames = [];
	}

	public search(callback): void {
		this.currentCallback = callback;
		this.configFile.gamesFolders.forEach((folder) => {
			let gameFolder: string = '';

			if (folder.startsWith('~')) {
				gameFolder = path.join(this.configFile.installFolder, folder.substr(1), this.manifestRegEx);
			}
			else
				gameFolder = path.join(folder, this.manifestRegEx);
			glob(gameFolder, this.processGames.bind(this));
		});
	}

	private processGames(error, files): void {
		let counter: number = 0;
		if (!files.length) {
			/* TODO: Remove this */
			let blankGame: PotentialSteamGame = new PotentialSteamGame('PuTTY', null);
			blankGame.commandLine = ['C:/Users/P.ROMAN/Desktop/putty.exe'];
			this.currentCallback(null, [blankGame]);
			return;
		}
		files.forEach((appManifest, index, array) => {
			let gameManifest: any = new AcfParser(appManifest).toObject().AppState;
			let igdbWrapper: IgdbWrapper = new IgdbWrapper();

			igdbWrapper.getGame(gameManifest.name, (error, game) => {
				if (error)
					return;

				let potentialGame: PotentialSteamGame = new PotentialSteamGame(gameManifest.name, game);
				let commandArgs: string[] = this.configFile.launchCommand.split(' ');
				potentialGame.commandLine = [
					path.join(this.configFile.installFolder, 'steam.exe'),
					commandArgs[0],
					commandArgs[1].replace('%id', gameManifest.appid)
				];
				potentialGame.uuid = uuidV5(potentialGame.name);
				this.potentialGames.push(potentialGame);

				counter++;
				if (counter === array.length) {
					this.currentCallback(null, this.potentialGames);
					delete this.currentCallback;
				}
			});
		});
	}
}

export function getSteamCrawlerPromise() {
	return new Promise((resolve, reject) => {
		new SteamGamesCrawler().search((error, potentialGames) => {
			if (error)
				reject(error);
			else
				resolve(potentialGames);
		});
	});
}
