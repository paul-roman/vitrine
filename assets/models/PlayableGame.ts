import * as fs from 'fs-extra';
import * as path from 'path';

import { PotentialGame } from './PotentialGame';
import { getEnvFolder } from './env';

export class PlayableGame extends PotentialGame {
	public timePlayed: number;
	public ambientColor: string;

	public constructor(name: string, details?: any) {
		super(name, details);
		this.timePlayed = 0;
		this.ambientColor = null;
	}

	public addPlayTime(timePlayed: number, errorCallback?: (error: Error) => void) {
		this.timePlayed += timePlayed;

		let configFilePath: string = path.resolve(getEnvFolder('games'), this.uuid, 'config.json');
		fs.writeFile(configFilePath, JSON.stringify(this, null, 2), (error: Error) => {
			if (error && errorCallback)
				errorCallback(error);
		});
	}

	public static toPlayableGame(game: PotentialGame): PlayableGame {
		let playableGame: PlayableGame =  new PlayableGame(game.name, game.details);
		playableGame.uuid = game.uuid;
		playableGame.source = game.source;
		playableGame.commandLine = game.commandLine;
		playableGame.timePlayed = 0;

		return playableGame;
	}
}
