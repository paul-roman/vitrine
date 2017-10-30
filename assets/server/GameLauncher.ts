import * as childProcess from 'child_process';
import * as path from 'path';

import { GameSource } from '../models/PotentialGame';
import { PlayableGame } from '../models/PlayableGame';
import { getEnvFolder } from '../models/env';

class GameLauncher {
	private scriptPath: string;
	private watcherPath: string;

	public constructor(private game: PlayableGame) {
		this.scriptPath = path.resolve(getEnvFolder('scripts'), 'gameLauncher.exe');
		this.watcherPath = path.resolve(getEnvFolder('scripts'), 'regWatcher.exe');
	}

	public launch(callback: Function) {
		switch (+this.game.source) {
			case GameSource.LOCAL: {
				this.launchStandardGame(callback);
				break;
			}
			case GameSource.ROM: {
				this.launchStandardGame(callback);
				break;
			}
			case GameSource.ORIGIN: {
				this.launchStandardGame(callback);
				break;
			}
			case GameSource.STEAM: {
				this.launchSteamGame(callback);
				break;
			}
		}
	}

	private launchStandardGame(callback: Function) {
		let [executable, args] = this.game.commandLine;

		let beginTime: Date = new Date();
		childProcess.exec(`"${executable}" ${args}`, (error: Error) => {
			if (error) {
				callback(error, null);
				return;
			}
			let endTime: Date = new Date();
			let secondsPlayed: number = Math.round((endTime.getTime() - beginTime.getTime()) / 1000);
			callback(null, secondsPlayed);
		});
	}

	private launchSteamGame(callback: Function) {
		childProcess.exec(`"${this.watcherPath}" ${this.game.details.steamId}`, (error: Error) => {
			if (error) {
				callback(error, null);
				return;
			}
			let beginTime: Date = new Date();
			childProcess.exec(`"${this.watcherPath}" ${this.game.details.steamId}`, (error: Error) => {
				if (error) {
					callback(error, null);
					return;
				}
				let endTime: Date = new Date();
				let secondsPlayed: number = Math.round((endTime.getTime() - beginTime.getTime()) / 1000);
				callback(null, secondsPlayed);
			});
		});

		let [executable, args] = this.game.commandLine;
		console.log(executable, '|', args.replace(/\\/g, '/'));
		childProcess.exec(`"${executable}" ${args.replace(/\\/g, '/')}`, (error: Error) => {
			if (error)
				callback(error, null);
		});
	}
}

export function getGameLauncher(game: PlayableGame): Promise<any> {
	return new Promise((resolve, reject) => {
		new GameLauncher(game).launch((error, minutesPlayed) => {
			if (error)
				reject(error);
			else
				resolve(minutesPlayed);
		});
	});
}
