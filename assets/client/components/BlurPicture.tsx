import * as React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { rgba } from 'css-verbose';

import { VitrineComponent } from './VitrineComponent';
import { urlify } from '../helpers';

export class BlurPicture extends VitrineComponent {
	private pulseDuration: number;
	private mounted: boolean;

	public constructor(props: any) {
		super(props);

		let divWidth: number = (this.props.width) ? (this.props.width) : (3.136);
		let divHeight: number = (this.props.height) ? (this.props.height) : (4.48);
		this.pulseDuration = 165;

		this.state = {
			divClassName: '',
			divStyle: {
				width: `${divWidth}em`,
				height: `${divHeight}em`,
				fontSize: `${this.props.fontSize}px`,
				animationDuration: `${this.pulseDuration}ms`
			},
			imageStyle: {
				backgroundImage: urlify(this.props.background)
			},
			iconClassName: '',
			iconStyle: {
				display: 'none',
				animationDuration: '75ms'
			}
		};
	}

	private mouseEnterHandler() {
		let imageStyle: any = this.state.imageStyle;
		let iconStyle: any = this.state.iconStyle;
		imageStyle.filter = `blur(${4}px)`;
		iconStyle.display = 'inline';

		if (!this.mounted)
			return;
		this.setState({
			imageStyle: {
				backgroundImage: urlify(this.props.background),
				filter: `blur(${4}px)`
			},
			iconClassName: 'animated zoomIn',
			iconStyle: iconStyle
		});
	}

	private mouseLeaveHandler() {
		let imageStyle: any = this.state.imageStyle;
		let iconStyle: any = this.state.iconStyle;
		imageStyle.filter = '';
		iconStyle.display = 'none';

		if (!this.mounted)
			return;
		this.setState({
			imageStyle: {
				backgroundImage: urlify(this.props.background),
				filter: ''
			},
			iconClassName: 'animated zoomOut',
			iconStyle: iconStyle
		});
	}

	private clickHandler() {
		if (!this.mounted)
			return;
		this.setState({
			divClassName: 'animated pulse'
		}, () => {
			if (!this.mounted)
				return;
			setTimeout(() => {
				this.setState({
					divClassName: ''
				});
			}, this.pulseDuration);
		});

		this.props.clickHandler();
	}

	public componentWillReceiveProps(props: any) {
		if (!this.mounted)
			return;
		this.setState({
			imageStyle: {
				backgroundImage: urlify(props.background),
				filter: ''
			}
		});
	}

	public componentDidMount() {
		this.mounted = true;
	}

	public componentWillUnmount() {
		this.mounted = false;
	}

	public render(): JSX.Element {
		return (
			<div
				className={`${css(styles.container)} ${this.state.divClassName}`}
				onMouseEnter={this.mouseEnterHandler.bind(this)}
				onMouseLeave={this.mouseLeaveHandler.bind(this)}
				onClick={this.clickHandler.bind(this)}
				style={this.state.divStyle}
			>
				<div className={css(styles.picture)} style={{ ...this.state.imageStyle }}/>
				<i
					className={`fa fa-${this.props.faIcon} ${css(styles.icon)} ${this.state.iconClassName}`}
					style={{ ...this.state.iconStyle }}
				/>
				{this.checkErrors()}
			</div>
		);
	}
}

const styles: React.CSSProperties = StyleSheet.create({
	container: {
		overflow: 'hidden',
		position: 'relative',
		left: 40,
		color: '#F1F1F1',
		textShadow: `${0} ${0} ${10}px ${rgba(8, 8, 8, 0.17)}`,
		boxShadow: `${0} ${0} ${10}px ${rgba(0, 0, 0, 0.55)}`
	},
	picture: {
		width: 100..percents(),
		height: 100..percents(),
		cursor: 'pointer',
		backgroundRepeat: 'no-repeat',
		backgroundSize: `${100..percents()} ${100..percents()}`,
		transform: `scale(${1.02.percents()})`,
		transition: `${75}ms filter linear`
	},
	icon: {
		position: 'absolute',
		opacity: 0.6,
		left: 1.268.em(),
		top: 1.74.em(),
		cursor: 'pointer'
	}
});
