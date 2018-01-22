import * as React from 'react';
import { remote } from 'electron';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as glob from 'glob';

import { serverListener } from '../ServerListener';
import { Vitrine } from './Vitrine';
import { localizer } from '../Localizer';
import { getEnvFolder } from '../../models/env';
import { ErrorsWrapper } from './ErrorsWrapper';

export class App extends React.Component<null, any> {
	private settings: any;

	public constructor() {
		super(undefined);

		this.state = {
			settingsReceived: false
		};

		this.initLanguages();
		$(document).on('show.bs.modal', '.modal', function() {
			let zIndex: number = 1040 + (10 * $('.modal:visible').length);
			$(this).css('z-index', zIndex);
			setTimeout(() => {
				$('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
			}, 0);
		});
	}

	private initLanguages() {
		let langFilesFolder: string = getEnvFolder('config/lang');
		let configLang: string = (this.settings && this.settings.lang) ? (this.settings.lang) : ('');
		let systemLang: string = remote.app.getLocale();

		let langFilesPaths: string[] = glob.sync(`${langFilesFolder}/*`);
		let counter: number = 0;
		langFilesPaths.forEach((langFilePath: string) => {
			let langName: string = path.basename(langFilePath).slice(0, -5);
			let langFile: any = fs.readJsonSync(langFilePath);
			localizer.addLanguage(langName, langFile);
			if (!configLang && systemLang === langName)
				localizer.setLanguage(langName);
			counter++;
			if (counter === langFilesPaths.length && configLang)
				localizer.setLanguage(configLang);
		});
	}

	public componentDidMount() {
		serverListener.listen('init-settings', (settings: any) => {
			this.settings = settings;
			this.setState({
				settingsReceived: true
			}, () => {
				serverListener.send('ready');
			});
		});
		serverListener.send('settings-asked');
	}

	public render(): JSX.Element {
		return (this.state.settingsReceived) ? (
			<ErrorsWrapper>
				<Vitrine settings={this.settings}/>
			</ErrorsWrapper>
		) : (null);
	}
}
