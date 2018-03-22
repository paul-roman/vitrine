import * as path from 'path';
import * as fs from 'fs-extra';

import { VitrineServer } from './VitrineServer';
import { getEnvData, getEnvFolder } from '../models/env';
import { logger } from './Logger';

export class VitrinePipeline {
	private serverInstance: VitrineServer;
	private prod: boolean;
	private configFileName: string;
	private gamesFolderPath: string;
	private configFolderPath: string;
	private vitrineConfigFilePath: string;
	private vitrineConfig: any;

	public constructor(prod?: boolean) {
		this.prod = (prod !== undefined) ? (prod) : ((getEnvData().env) ? (true) : (false));
		this.configFileName = 'vitrine_config.json';
		this.gamesFolderPath = getEnvFolder('games');
		this.configFolderPath = getEnvFolder('config');
	}

	public launch() {
		fs.ensureDirSync(this.configFolderPath);
		fs.ensureDirSync(this.gamesFolderPath);

		let configFolderOriginalPath: string = getEnvFolder('config', true);
		this.vitrineConfigFilePath = path.resolve(this.configFolderPath, this.configFileName);
		if (!fs.pathExistsSync(this.vitrineConfigFilePath))
			fs.copySync(configFolderOriginalPath, this.configFolderPath);
		this.vitrineConfig = fs.readJsonSync(this.vitrineConfigFilePath, { throws: false });
		logger.info('VitrinePipeline', 'vitrine_config.json read.');
		this.includeEmulatorsConfig().then(() => {
			this.launchMainClient();
		});
	}

	private registerDebugPromiseHandler() {
		process.on('unhandledRejection', (reason: Error) => {
			console.error('[PROCESS] Unhandled Promise Rejection');
			console.error('=====================================');
			console.error(reason);
			console.error('===');
		});
	}

	private includeEmulatorsConfig(): Promise<any> {
		return new Promise((resolve) => {
			logger.info('VitrinePipeline', 'Including emulators and platforms data.');
			let platformsConfigFilePath: string = path.resolve(this.configFolderPath, 'platforms.json');
			let emulatorsConfigFilePath: string = path.resolve(this.configFolderPath, 'emulators.json');
			let emulated: any = this.vitrineConfig.emulated || {};
			let newVitrineConfig: any = (this.vitrineConfig.lang) ? ({ ...this.vitrineConfig, emulated }) : ({ firstLaunch: true, emulated });
			newVitrineConfig.emulated.platforms = fs.readJsonSync(platformsConfigFilePath, { throws: false });
			newVitrineConfig.emulated.emulators = fs.readJsonSync(emulatorsConfigFilePath, { throws: false });
			logger.info('VitrinePipeline', 'Emulators and platforms added to config.');
			this.vitrineConfig = newVitrineConfig;
			resolve();
		});
	}

	private launchMainClient() {
		logger.info('VitrinePipeline', 'Launching main client.');
		if (!this.prod)
			this.registerDebugPromiseHandler();
		this.serverInstance = new VitrineServer(this.vitrineConfig, this.vitrineConfigFilePath, this.configFolderPath);
		this.serverInstance.registerEvents();
		this.serverInstance.run(this.prod);
	}
}
