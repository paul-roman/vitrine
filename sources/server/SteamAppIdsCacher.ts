import * as fs from 'fs-extra';
import * as path from 'path';

import { getEnvFolder } from '@models/env';
import { steamApiClient } from './api/SteamApiClient';
import { logger } from './Logger';

export class SteamAppIdsCacher {
  private readonly cacheFilePath: string;

  public constructor() {
    this.cacheFilePath = path.resolve(getEnvFolder('config'), 'cache', 'steam_app_ids.json');
  }

  public async cache(appIds: number[]) {
    logger.info('SteamAppIdsCacher', `Steam apps IDs are about to be cached.`);
    const appIdsCache: any = (await fs.pathExists(this.cacheFilePath)) ? (await fs.readJson(this.cacheFilePath, { throws: false })) || {} : {};

    let addedAppsNb: number = 0;
    const populatedAppIds: any[] = (await Promise.all(
      appIds.map(async (appId: number) => {
        if (!appIdsCache[appId]) {
          try {
            const data: any = await steamApiClient.getGamesDetails(appId);
            const gameData: any = data[Object.keys(data)[0]].data;
            if (gameData === undefined || gameData.type !== 'game') {
              return null;
            }
            appIdsCache[appId] = gameData.name.replace(/[^\x00-\x7F]/g, '');
            addedAppsNb++;
          } catch (error) {
            logger.info('SteamAppIdsCacher', `Request to Steam API for specific game ${appId} failed.`);
          }
        }
        return {
          appId,
          name: appIdsCache[appId]
        };
      })
    )).filter((appData: any) => appData !== null);
    if (addedAppsNb) {
      await fs.writeJson(this.cacheFilePath, appIdsCache, { spaces: 2 });
    }
    logger.info('SteamAppIdsCacher', `Steam apps IDs have been cached.`);
    return populatedAppIds;
  }

  public async invalidCache() {
    await fs.writeJson(this.cacheFilePath, {});
  }
}

export const steamAppIdsCacher: SteamAppIdsCacher = new SteamAppIdsCacher();
