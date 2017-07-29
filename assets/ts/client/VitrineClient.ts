import { ipcRenderer } from 'electron';

import { GamesCollection } from '../models/GamesCollection';
import { PotentialGame } from '../models/PotentialGame';
import { PlayableGame } from '../models/PlayableGame';
import { beforeCss } from './helpers';

export class VitrineClient {
	private potentialGames: GamesCollection<PotentialGame>;
	private playableGames: GamesCollection<PlayableGame>;
	private selectedGameId: string;

	constructor() {
		this.potentialGames = new GamesCollection();
		this.playableGames = new GamesCollection();
	}

	public run() {
		this.selectedGameId = '';
		ipcRenderer.send('client.ready');
	}

	public launchEvents() {
		ipcRenderer.on('server.send-game', (event, game) => {
			$('#game-cover-container').css({
				'display': 'block'
			});
			$('#game-title').html(game.name);
			$('#game-desc').addClass('game-desc').html(game.summary);
			$('#game-cover-image').css({
				'background-image': 'url(' + game.cover + ')',
				'background-repeat': 'no-repeat',
				'background-size': '100% 100%',
			});
			if (game.screenshots.length) {
				beforeCss('#game-background', {
					'background-image': 'url(' + game.screenshots[0] + ')'
				});
			}
		});

		ipcRenderer.on('server.send-game-error', (event, error) => {
			$('#game-title').html(error);
			throw new Error(error);
		});

		ipcRenderer.on('server.add-potential-games', (event, games) => {
			this.potentialGames.games = games;
			this.renderPotentialGames();
		});

		ipcRenderer.on('server.add-playable-games', (event, games) => {
			this.playableGames.games = games;
			this.renderPlayableGames();
		});

		ipcRenderer.on('server.remove-potential-game', (event, gameId) => {
			this.potentialGames.removeGame(gameId, (error, game: PotentialGame) => {
				if (error)
					throw new Error(error);
				else if (game) {
					this.renderPotentialGames();
				}
			})
		});

		ipcRenderer.on('server.add-playable-game', (event, playableGame) => {
			this.playableGames.addGame(playableGame);
			this.renderPlayableGames();
		});
	}

	private renderPotentialGames() {
		$('#potential-games-list').html('');

		this.potentialGames.sort();

		let counter: number = 0;
		this.potentialGames.forEach((potentialGame: PotentialGame) => {
			let html: string = '<li>' +
				//'<a game-id="' + potentialGame.uuid + '">' + potentialGame.name + '</a>' +
				'<button game-id="' + potentialGame.uuid + '" class="btn btn-success btn-sm add-game-btn">Add ' + potentialGame.name + '</button>' +
				'</li>';
			$('#potential-games-list').append(html);
			counter++;
			if (counter == this.potentialGames.games.length)
				this.createGameClickEvents(false);
		});
	}

	private renderPlayableGames() {
		$('#playable-games-list').html('');

		this.playableGames.sort();

		let counter: number = 0;
		this.playableGames.forEach((playableGame: PlayableGame) => {
			let html: string = '<li><a class="play-game-link" game-id="' + playableGame.uuid + '">' + playableGame.name + '</a></li>';
			$('#playable-games-list').append(html);
			counter++;
			if (counter == this.playableGames.games.length)
				this.createGameClickEvents(true);
		});
	}

	private createGameClickEvents(treatingPlayableGames: boolean) {
		if (treatingPlayableGames) {
			$('a.play-game-link[game-id]').each((index, value) => {
				$(value).click(() => {
					let gameId: string = $(value).attr('game-id');
					this.playableGames.getGame(gameId, (error, game) => {
						if (error)
							throw new Error(error);
						if (this.selectedGameId === gameId)
							return;
						let gameCover: string = 'url(' + game.details.cover.split('\\').join('\\\\') + ')';
						let gameBgScreen: string = 'url(' + game.details.backgroundScreen.split('\\').join('\\\\') + ')';
						$('#game-cover-container').css({
							'display': 'block'
						});
						$('#game-title').html(game.name);
						$('#game-desc').addClass('game-desc').html(game.details.summary);
						$('#game-cover-image').css({
							'background-image': gameCover,
							'background-repeat': 'no-repeat',
							'background-size': '100% 100%',
						});
						beforeCss('#game-background', {
							'background-image': gameBgScreen
						});
						this.selectedGameId = gameId;
					});
					// ipcRenderer.send('client.launch-game', gameId);
				});
			});
		}
		else {
			$('button.add-game-btn[game-id]').each((index, value) => {
				$(value).click(() => {
					let gameId: string = $(value).attr('game-id');
					ipcRenderer.send('client.add-game', gameId);
				});
			});
		}
	}
}