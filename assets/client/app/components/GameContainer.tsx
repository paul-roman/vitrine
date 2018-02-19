import * as React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { margin, padding, rgba } from 'css-verbose';
import * as FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { PlayableGame } from '../../../models/PlayableGame';
import { VitrineComponent } from './VitrineComponent';
import { BlurPicture } from './BlurPicture';
import { CirclePercentage } from './CirclePercentage';
import { editColor, formatTimePlayed, urlify } from '../helpers';
import { localizer } from '../Localizer';

import { faPlay } from '@fortawesome/fontawesome-free-solid';
import * as lessVars from 'less-vars-loader?camelCase&resolveVariables!../../resources/less/theme/globals/site.variables';

interface Props {
	selectedGame: PlayableGame
	launchGame: Function
}

interface State {
	backgroundImage: string,
	mainColor: string
}

export class GameContainer extends VitrineComponent<Props, State> {
	public constructor(props: Props) {
		super(props);

		this.state = {
			backgroundImage: 'none',
			mainColor: lessVars.primaryColor
		};
	}

	public componentWillReceiveProps(props: Props) {
		if (!props.selectedGame) {
			this.setState({
				backgroundImage: 'none',
				mainColor: lessVars.primaryColor
			});
			return;
		}
		let backgroundImage, mainColor: string;
		if (props.selectedGame && props.selectedGame.details.backgroundScreen) {
			backgroundImage = urlify(props.selectedGame.details.backgroundScreen);
			mainColor = props.selectedGame.ambientColor || lessVars.primaryColor;
		}
		else {
			backgroundImage = 'none';
			mainColor = lessVars.primaryColor;
		}
		this.setState({
			backgroundImage,
			mainColor
		});
	}

	public render(): JSX.Element {
		let gameContainer: JSX.Element;

		if (this.props.selectedGame) {
			gameContainer = (
				<div className={`row ${css(styles.selectedGameCore)}`}>
					<div className="col-md-8">
						<h1 className={css(styles.selectedGameCoreH1)}>{this.props.selectedGame.name}</h1>
						<div className={css(styles.selectedGameInfos)}>
							<button
								onClick={this.props.launchGame.bind(null, this.props.selectedGame.uuid)}
								className="btn btn-primary"
								style={{ backgroundColor: this.state.mainColor, borderColor: editColor(this.state.mainColor, -20) }}
							>
								<FontAwesomeIcon icon={faPlay} size={'sm'}/> {localizer.f('play')}
							</button>
							<span className={css(styles.selectedGameInfosSpan)}>
								{(this.props.selectedGame.timePlayed) ? (formatTimePlayed(this.props.selectedGame.timePlayed)) : ('')}
							</span>
						</div>
						<div className={css(styles.selectedGameInfos)}>
							<div className="row">
								<div className="col-md-8">
									<div className="row">
										<div className="col-md-4">
											<strong>{localizer.f('developerLabel')}</strong>
										</div>
										<div className="col-md-8">
											{this.props.selectedGame.details.developer}
										</div>
									</div>
									<div className="row">
										<div className="col-md-4">
											<strong>{localizer.f('publisherLabel')}</strong>
										</div>
										<div className="col-md-8">
											{this.props.selectedGame.details.publisher}
										</div>
									</div>
								</div>
								<div className="col-md-4">
									<CirclePercentage
										percentage={this.props.selectedGame.details.rating}
										color={this.state.mainColor}
									/>
								</div>
							</div>
							<hr className={css(styles.selectedGameCoreHr)}/>
							<p className={css(styles.selectedGameDesc)}>
								{this.props.selectedGame.details.summary.split('\n').map((section: string, index: number) =>
									<span key={index}>
										{section}
										<br/>
									</span>
								)}
							</p>
						</div>
					</div>
					<div className="col-md-4">
						<div className={css(styles.coverDiv)}>
							<BlurPicture
								faIcon={faPlay}
								fontSize={125}
								background={this.props.selectedGame.details.cover}
								clickHandler={this.props.launchGame.bind(null, this.props.selectedGame.uuid)}
							/>
						</div>
					</div>
				</div>
			);
		}
		else {
			gameContainer = (
				<div className={css(styles.noSelectedGame)}>
					<h1>{localizer.f('welcomeMessage')}</h1>
					<hr className={css(styles.noSelectedGameH1)}/>
					<p>{localizer.f('desc')}</p>
				</div>
			);
		}

		return (
			<div className="row full-height">
				<div className={`col-sm-8 col-lg-10 col-sm-offset-4 col-lg-offset-2 ${css(styles.selectedGameContainer)}`}>
					<div className={`full-height selected-game-background`}>
						{gameContainer}
						<div
							className={css(styles.selectedGameBackground)}
							style={{ backgroundImage: this.state.backgroundImage }}
						/>
					</div>
				</div>
				{this.checkErrors()}
			</div>
		);
	}
}

const styles: React.CSSProperties = StyleSheet.create({
	selectedGameContainer: {
		height: `${100}%`,
		background: `radial-gradient(ellipse at center, ${rgba(131, 131, 131, 0.08)} ${0}%, ${rgba(0, 0, 0, 0.76)} ${120..percents()})`,
		overflow: 'hidden'
	},
	selectedGameBackground: {
		position: 'absolute',
		zIndex: -1,
		width: 100..percents(),
		height: 100..percents(),
		top: 0,
		left: 0,
		opacity: 0.8,
		backgroundRepeat: 'no-repeat',
		backgroundSize: `${100..percents()} ${100..percents()}`,
		filter: `blur(${4..px()})`,
		transition: `${150}ms ease`
	},
	noSelectedGame: {
		padding: 50
	},
	noSelectedGameH1: {
		fontWeight: 300,
		fontSize: 50
	},
	selectedGameCore: {
		padding: padding(25, 50)
	},
	selectedGameCoreH1: {
		fontWeight: 400,
		fontSize: 33,
		marginBottom: 40,
		color: lessVars.textColor
	},
	selectedGameCoreHr: {
		borderTop: `solid ${1..px()} ${rgba(210, 210, 210, 0.15)}`
	},
	selectedGameInfos: {
		backgroundColor: rgba(0, 0, 0, 0.49),
		padding: padding(13, 24),
		color: '#E4E4E4',
		fontSize: 1.2.em(),
		borderRadius: 3,
		margin: margin(10, 0)
	},
	selectedGameInfosSpan: {
		marginLeft: 15
	},
	selectedGameDesc: {
		maxHeight: 170,
		overflowY: 'auto',
		backgroundColor: rgba(0, 0, 0, 0.2),
		borderRadius: 3
	},
	coverDiv: {
		paddingLeft: 40
	}
});
