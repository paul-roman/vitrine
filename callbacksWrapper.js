// This file is used to clean up the main class file and to store callbacks here

module.exports = {
	_addDeveloperCallback(developer) {
		this.currentGame.developers = developer.name;
		this._findCompanyById(this.currentGame.publishers[0], module.exports._addPublisherCallback.bind(this));
	},

	_addPublisherCallback(publisher) {
		this.currentGame.publishers = publisher.name;
		this._findSeriesById(this.currentGame.collection, module.exports._addSeriesCallback.bind(this));
	},

	_addSeriesCallback(series) {
		delete this.currentGame['collection'];
		this.currentGame.series = series.name;
		this.currentCallback(this.currentGame);
		this.currentGame = this.currentCallback = null;
	}
};
