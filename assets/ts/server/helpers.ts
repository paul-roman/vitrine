import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid/v5';
import * as Levenshtein from 'levenshtein';

import { getEnvData } from '../models/env';

export function uuidV5(name: string) {
	let dnsNamespace: string = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

	return uuid(name, dnsNamespace);
}

export function downloadFile(url: string, path: string, isHttps: boolean, callback: Function) {
	if (!url) {
		callback(false);
		return;
	}
	let file = fs.createWriteStream(path);
	if (url.startsWith('file://')) {
		fs.createReadStream(url.substr(7)).pipe(file);
		callback(true);
	}
	else {
		let protocol: any = (isHttps) ? (https) : (http);
		protocol.get(url, (response) => {
			response.pipe(file);
			callback(true);
		});
	}
}

export function getEnvFolder(folder: string) {
	return path.resolve(__dirname, (getEnvData().env) ? ('../../' + folder) : ('../' + folder));
}
