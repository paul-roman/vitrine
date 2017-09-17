import * as React from 'react';

import './AddPotentialGamesModal.scss';
import { PotentialGame } from '../../../../models/PotentialGame';
import { BlurPicture } from '../BlurPicture/BlurPicture';
import { localizer } from '../../Localizer';

export class AddPotentialGamesModal extends React.Component<any, any> {
	public constructor(props: any) {
		super(props)
	}

	private gameCoverClickHandler(potentialGame: PotentialGame) {
		this.props.potentialGameUpdateCallback(potentialGame);
	}

	public render(): JSX.Element {
		return (
			<div id="add-potential-games-modal" className="modal fade" role="dialog">
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal">&times;</button>
							<h4 className="modal-title">{ localizer.f('addGames') }</h4>
						</div>
						<div className="modal-body">
							<div className="row potential-games-row">
								{ this.props.potentialGames.games.map((potentialGame: PotentialGame, index: number) =>
									<div key={ index } className="col-md-3">
										<div className="potential-game-cover">
											<BlurPicture
												faIcon={ 'plus-circle' }
												fontSize={ 55 }
												background={ potentialGame.details.cover }
												clickHandler={ this.gameCoverClickHandler.bind(this, potentialGame) }
											/>
											<span className="potential-game-name">{ potentialGame.name }</span>
										</div>
									</div>
								) }
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}