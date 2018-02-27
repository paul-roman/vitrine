import { Action, ActionType } from './actionsTypes';

export function openGameAddModal(): Action {
	return {
		type: ActionType.OPEN_GAME_ADD_MODAL,
		payload: {
			GameAddModalVisible: true
		}
	};
}

export function closeGameAddModal(): Action {
	return {
		type: ActionType.CLOSE_GAME_ADD_MODAL,
		payload: {
			GameAddModalVisible: false
		}
	};
}

export function openIgdbResearchModal(): Action {
	return {
		type: ActionType.OPEN_IGDB_RESEARCH_MODAL,
		payload: {
			igdbResearchModalVisible: true
		}
	};
}

export function closeIgdbResearchModal(): Action {
	return {
		type: ActionType.CLOSE_IGDB_RESEARCH_MODAL,
		payload: {
			igdbResearchModalVisible: false
		}
	};
}

export function openTimePlayedEditionModal(): Action {
	return {
		type: ActionType.OPEN_TIME_PLAYED_EDITION_MODAL,
		payload: {
			timePlayedEditionModalVisible: true
		}
	};
}

export function closeTimePlayedEditionModal(): Action {
	return {
		type: ActionType.CLOSE_TIME_PLAYED_EDITION_MODAL,
		payload: {
			timePlayedEditionModalVisible: false
		}
	};
}

export function openPotentialGamesAddModal(): Action {
	return {
		type: ActionType.OPEN_POTENTIAL_GAMES_ADD_MODAL,
		payload: {
			potentialGamesAddModalVisible: true
		}
	};
}

export function closePotentialGamesAddModal(): Action {
	return {
		type: ActionType.CLOSE_POTENTIAL_GAMES_ADD_MODAL,
		payload: {
			potentialGamesAddModalVisible: false
		}
	};
}
