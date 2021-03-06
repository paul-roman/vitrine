import { Action, ActionType } from '../actions/actionsTypes';

export function settings(state: any = {}, action: Action): any {
  switch (action.type) {
    case ActionType.UPDATE_SETTINGS:
      return action.payload.settings;
    default:
      return state;
  }
}

export function modulesConfig(state: any = {}, action: Action): any {
  switch (action.type) {
    case ActionType.UPDATE_MODULES_CONFIG:
      return action.payload.modulesConfig;
    default:
      return state;
  }
}

export function locales(state: any[] = [], action: Action): any[] {
  switch (action.type) {
    case ActionType.SET_LOCALES:
      return action.payload.locales;
    default:
      return state;
  }
}

export function locale(state: string = '', action: Action): string {
  switch (action.type) {
    case ActionType.SET_LOCALE:
      return action.payload.locale;
    default:
      return state;
  }
}

export function internetConnection(state: boolean = true, action: Action): boolean {
  switch (action.type) {
    case ActionType.SET_INTERNET_CONNECTION:
      return action.payload.internetConnection;
    default:
      return state;
  }
}
