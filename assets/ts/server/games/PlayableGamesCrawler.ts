import * as fs from 'fs';
import * as path from 'path';

import { PlayableGame } from '../../models/PlayableGame';
import { GamesCollection } from '../../models/GamesCollection';

class PlayableGamesCrawler {
	private playableGames: PlayableGame[];
	private gamesDirectory: string;
	private callback: Function;

	constructor() {
		this.playableGames = [];
		this.gamesDirectory = path.join(__dirname, 'games');
	}

	public search(callback) {
		this.callback = callback;
		fs.readdir(this.gamesDirectory, (error, files) => {
			if (error) {
				this.callback(error, null);
				return;
			}
			if (!files.length) {
				let playableGames: GamesCollection<PlayableGame> = new GamesCollection();
				this.callback(null, playableGames);
				return;
			}
			let counter: number = 0;
			files.forEach((gameId) => {
				let configFilePath: any = path.join(this.gamesDirectory, gameId, 'config.json');
				if (fs.existsSync(configFilePath)) {
					let playableGame: PlayableGame = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
					this.playableGames.push(playableGame);
				}
				counter++;
				if (counter === files.length) {
					let playableGames: GamesCollection<PlayableGame> = new GamesCollection();
					playableGames.games = this.playableGames;
					this.callback(null, playableGames);
					delete this.callback;
				}
			});
		});
	}
}

export function getPlayableGamesCrawlerPromise() {
	return new Promise((resolve, reject) => {
		new PlayableGamesCrawler().search((error, playableGames: PlayableGame[]) => {
			if (error)
				reject(error);
			else
				resolve(playableGames);
		});
	});
}