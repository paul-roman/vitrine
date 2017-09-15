import * as path from 'path';
import * as fs from 'fs';
import * as React from 'react';
import { render } from 'react-dom';

import * as jQuery from 'jquery';
window.jQuery = window.$ = jQuery;
import 'bootstrap-sass';
import 'electron-titlebar-absolute';
import 'bootstrap-datepicker';
import 'jquery-contextmenu';

import { getEnvData } from '../../models/env';

import { TitleBar } from './components/TitleBar/TitleBar';
import { Vitrine } from './components/Vitrine/Vitrine';

import './main.scss';
import { extendJQuery } from '../helpers';
import { localizer } from './Localizer';

class App extends React.Component {
	public constructor() {
		super();

		extendJQuery();

		let langFilesFolder: string = App.getEnvFolder('config/lang');
		let enLocale: any = JSON.parse(fs.readFileSync(path.resolve(langFilesFolder, 'en.json')).toString());
		let frLocale: any = JSON.parse(fs.readFileSync(path.resolve(langFilesFolder, 'fr.json')).toString());
		localizer.addLanguage('en', enLocale);
		localizer.addLanguage('fr', frLocale);
		localizer.setLanguage('fr');

		$(document).on('show.bs.modal', '.modal', function() {
			let zIndex = 1040 + (10 * $('.modal:visible').length);
			$(this).css('z-index', zIndex);
			setTimeout(() => {
				$('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
			}, 0);
		});
	}

	public render() {
		return (
			<div className="full-height">
				<TitleBar/>
				<Vitrine/>
			</div>
		);
	}

	// TODO: Remove this helper
	private static getEnvFolder(folder: string): string {
		return path.resolve(__dirname, (getEnvData().env) ? ('../../' + folder) : ('../' + folder));
	}
}

render(<App/>, document.getElementById('app'));
