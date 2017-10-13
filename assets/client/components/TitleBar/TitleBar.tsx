import * as React from 'react';

import { VitrineComponent } from '../VitrineComponent';

import './TitleBar.scss';

export class TitleBar extends VitrineComponent {
	render() {
		let style: React.CSSProperties = {
			height: '29px'
		};

		return (
			<div id="electron-titlebar" className="drag" style={ style }>
				<img className="app-icon" src="img/vitrine.ico"/>
				<span className="app-title">Vitrine</span>
				{ this.checkErrors() }
			</div>
		);
	}
}