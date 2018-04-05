import * as fs from 'fs-extra';
import * as moment from 'moment';
import * as path from 'path';

import { isProduction } from '../models/env';

class Logger {
	private readonly filePath: string;
	private testEnv: boolean;

	public constructor() {
		if (isProduction()) {
			this.filePath = path.resolve(process.env.APPDATA, 'vitrine', 'data', 'vitrine.log.html');
			fs.ensureFileSync(this.filePath);
		}
		else
			this.filePath = path.resolve('vitrine.log.html');
	}

	public createLogger(testEnv?: boolean) {
		this.testEnv = testEnv || false;
		if (this.testEnv) {
			return;
		}
		const dateTime: string = moment().format('DD/MM HH:mm:ss');
		const initialLog: string = `<style>p { margin: 0 }</style><h3>Vitrine log</h3><p><strong>[ ${dateTime} ]</strong> Starting logging.</p>`;
		fs.writeFileSync(this.filePath, initialLog);
	}

	public info(channelName: string, message: any, displayed?: boolean) {
		if (this.testEnv) {
			return;
		}
		const dateTime: string = moment().format('DD/MM HH:mm:ss');
		const log: string = `<p><strong>[ ${dateTime} ][ ${channelName} ]</strong> ${message}</p>`;
		if (displayed) {
			console.log(`[ ${dateTime} ][ ${channelName} ] ${message}`);
		}
		fs.appendFileSync(this.filePath, log);
	}
}

export const logger: Logger = new Logger();
