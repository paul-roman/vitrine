import { connect, Dispatch } from 'react-redux';

import { PlayableGame } from '../../../models/PlayableGame';
import { PotentialGame } from '../../../models/PotentialGame';
import { Action } from '../actions/actionsTypes';
import { addPlayableGames, addPotentialGames, launchGame, removePlayableGame, selectGame, stopGame } from '../actions/games';
import { closeSettingsModal, openSettingsModal } from '../actions/modals';
import { updateSettings } from '../actions/settings';
import { AppState } from '../AppState';
import { Vitrine as VisualVitrine } from '../components/Vitrine';

const mapStateToProps = (state: AppState) => ({
	settings: state.settings,
	playableGames: state.playableGames,
	selectedGame: state.selectedGame,
	launchedGame: state.launchedGame,
	gameAddModalVisible: state.gameAddModalVisible,
	igdbResearchModalVisible: state.igdbResearchModalVisible,
	timePlayedEditionModalVisible: state.timePlayedEditionModalVisible,
	potentialGamesAddModalVisible: state.potentialGamesAddModalVisible,
	settingsModalVisible: state.settingsModalVisible
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
	updateSettings: (settings: any) => {
		dispatch(updateSettings(settings));
	},
	addPotentialGames: (potentialGames: PotentialGame[]) => {
		dispatch(addPotentialGames(potentialGames));
	},
	addPlayableGames: (playableGames: PlayableGame[]) => {
		dispatch(addPlayableGames(playableGames));
	},
	removePlayableGame: (gameUuid: string) => {
		dispatch(removePlayableGame(gameUuid));
	},
	launchGame: (launchedGame: PlayableGame) => {
		dispatch(launchGame(launchedGame));
	},
	stopGame: (playedGame: PlayableGame) => {
		dispatch(stopGame(playedGame));
	},
	selectGame: (selectedGame: PlayableGame) => {
		dispatch(selectGame(selectedGame));
	},
	openSettingsModal: () => {
		dispatch(openSettingsModal());
	},
	closeSettingsModal: () => {
		dispatch(closeSettingsModal());
	}
});

export const Vitrine = connect(mapStateToProps, mapDispatchToProps)(VisualVitrine);