import * as React from 'react';
import { ProgressInfo } from 'builder-util-runtime';
import { css, StyleSheet } from 'aphrodite';
import { rgba } from 'css-verbose';

import { loaderServerListener } from '../ServerListener';
import * as vitrineIcon from '../images/vitrine.ico';

export class VitrineLoader extends React.Component<null, any> {
	private lastUpdateVersion: string;

	public constructor() {
		super(undefined);

		this.state = {
			displayedInfo: 'Loading...',
			updateDownloadProgress: null
		};
	}

	public componentDidMount() {
		loaderServerListener.listen('update-found', this.startUpdateDownload.bind(this))
			.listen('update-progress', this.updateProgress.bind(this))
			.listen('no-update-found', this.launchClient.bind(this));

		loaderServerListener.send('ready');
		this.setState({
			displayedInfo: 'Searching for updates...'
		});
	}

	private startUpdateDownload(lastUpdateVersion: string) {
		this.lastUpdateVersion = lastUpdateVersion;
		this.setState({
			displayedInfo: `Updating to ${this.lastUpdateVersion}...`,
			updateDownloadProgress: 0
		});
	}

	private updateProgress(progress: ProgressInfo) {
		let updateDownloadProgress: number = Math.round(progress.percent);
		let displayedInfo: string = (updateDownloadProgress < 100)
			? (`Updating to ${this.lastUpdateVersion}... | ${updateDownloadProgress.percents()}`)
			: ('Restarting...');
		this.setState({
			updateDownloadProgress,
			displayedInfo
		});
	}

	private launchClient() {
		this.setState({
			displayedInfo: 'Launching...'
		}, () => {
			loaderServerListener.send('launch-client');
		});
	}

	public render(): JSX.Element {
		return (
			<div className={css(styles.loader)}>
				<span className={css(styles.titleSpan)}>Vitrine</span>
				<div className={css(styles.loaderDiv)}>
					<img
						src={vitrineIcon}
						className={css(styles.loaderIcon)}
					/>
				</div>
				<span
					className={css(styles.infosSpan)}
					style={{ display: (this.state.displayedInfo) ? ('inline') : ('none') }}
				>
					{this.state.displayedInfo}
					<i className={`fa fa-cog fa-fw fa-spin`}/>
				</span>
				<div
					className={`progress ${css(styles.downloadBar)}`}
					style={{ display: (this.state.updateDownloadProgress) ? ('block') : ('none') }}
				>
					<div
						className={`progress-bar active ${css(styles.downloadBarProgress)}`}
						role="progressbar"
						style={{ width: (this.state.updateDownloadProgress) ? (this.state.updateDownloadProgress.percents()) : (0..percents()) }}
					/>
				</div>
			</div>
		);
	}
}

const pulseKeyframes: any = {
	'to': {
		boxShadow: `${0} ${0} ${0} ${45..px()} ${rgba(141, 89, 24, 0)}`
	}
};

const styles: React.CSSProperties = StyleSheet.create({
	loader: {
		textAlign: 'center',
		padding: 7,
		userSelect: 'none',
		cursor: 'default'
	},
	loaderDiv: {
		margin: 4
	},
	loaderIcon: {
		width: 125,
		margin: 14,
		borderRadius: 100,
		boxShadow: `${0} ${0} ${0} ${0} ${rgba(141, 89, 24, 0.7)}`,
		animationName: [pulseKeyframes],
		animationDuration: `${1.25}s`,
		animationIterationCount: 'infinite',
		animationTimingFunction: `cubic-bezier(${0.66}, ${0}, ${0}, ${1})`
	},
	titleSpan: {
		fontWeight: 600,
		fontSize: 40,
		opacity: 0.4,
		textTransform: 'capitalize',
		fontVariant: 'small-caps'
	},
	infosSpan: {
		fontStyle: 'italic',
		opacity: 0.4,
		fontSize: 17
	},
	downloadBar: {
		width: 46..percents(),
		height: 8,
		marginLeft: 27..percents(),
		marginTop: 6,
		borderRadius: 3,
		backgroundColor: '#4A453F'
	},
	downloadBarProgress: {
		backgroundColor: '#736E67'
	}
});