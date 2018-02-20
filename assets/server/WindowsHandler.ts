import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron';
import * as path from 'path';

export class WindowsHandler {
	private loaderWindow: BrowserWindow;
	private clientWindow: BrowserWindow;
	private mainEntryPoint: string;
	private loaderEntryPoint: string;
	private tray: Tray;
	private devTools: boolean;
	private iconPath: string;
	private appQuit: boolean;

	public constructor() {
		this.mainEntryPoint = path.resolve('file://', __dirname, 'main.html');
		this.loaderEntryPoint = path.resolve('file://', __dirname, 'loader.html');
		this.iconPath = path.resolve(__dirname, 'img', 'vitrine.ico');
		this.appQuit = false;
	}

	public run(devTools?: boolean) {
		this.devTools = devTools;
		if (app.makeSingleInstance(this.restoreAndFocus.bind(this))) {
			this.quitApplication();
			return;
		}
		app.on('ready', this.createLoaderWindow.bind(this));
		app.on('window-all-closed', () => {
			if (process.platform !== 'darwin')
				this.quitApplication();
		});
		app.on('activate', () => {
			if (!this.clientWindow)
				this.createMainWindow();
		});
	}

	public clientReady() {
		this.createTrayIcon();
		this.loaderWindow.destroy();
		this.clientWindow.show();
	}

	public createLoaderWindow() {
		this.loaderWindow = new BrowserWindow({
			height: 300,
			width: 500,
			icon: this.iconPath,
			frame: false
		});
		this.loaderWindow.loadURL(this.loaderEntryPoint);
	}

	public createMainWindow() {
		this.clientWindow = new BrowserWindow({
			minWidth: 1450,
			minHeight: 700,
			icon: this.iconPath,
			show: false,
			frame: false,
			width: 1650,
			height: 900
		});
		this.clientWindow.setMenu(null);
		//this.clientWindow.maximize();
		this.clientWindow.loadURL(this.mainEntryPoint);
		this.clientWindow.hide();
		if (this.devTools)
			this.clientWindow.webContents.openDevTools();

		this.clientWindow.on('close', (event: Event) => {
			if (!this.appQuit) {
				event.preventDefault();
				this.clientWindow.hide();
			}
			else
				delete this.clientWindow;
		});
	}

	public quitApplication(mustRelaunch?: boolean) {
		if (mustRelaunch)
			app.relaunch();
		this.appQuit = true;
		if (this.tray)
			this.tray.destroy();
		app.quit();
	}

	public sendToLoader(channelName, ...args) {
		let sentArgs: any[] = [
			`loaderServer.${channelName}`,
			...args
		];
		this.loaderWindow.webContents.send.apply(this.loaderWindow.webContents, sentArgs);
	}

	public sendToClient(channelName, ...args) {
		let sentArgs: any[] = [
			`server.${channelName}`,
			...args
		];
		this.clientWindow.webContents.send.apply(this.clientWindow.webContents, sentArgs);
	}

	public listenToLoader(channelName: string, callbackFunction: Function): this {
		ipcMain.on(`loader.${channelName}`, (...args) => {
			args.shift();
			callbackFunction.apply(null, args);
		});
		return this;
	}

	public listenToClient(channelName: string, callbackFunction: Function): this {
		ipcMain.on(`client.${channelName}`, (...args) => {
			args.shift();
			callbackFunction.apply(null, args);
		});
		return this;
	}

	private createTrayIcon() {
		this.tray = new Tray(this.iconPath);
		this.tray.setTitle('Vitrine');
		this.tray.setToolTip('Vitrine');
		this.tray.setContextMenu(Menu.buildFromTemplate([
			{
				label: 'Show',
				type: 'normal',
				click: this.restoreAndFocus.bind(this)
			},
			{
				label: 'Quit',
				type: 'normal',
				click: this.quitApplication.bind(this, false)
			}
		]));
		this.tray.on('double-click', this.restoreAndFocus.bind(this));
	}

	private restoreAndFocus() {
		if (this.clientWindow) {
			this.clientWindow.show();
			if (this.clientWindow.isMinimized())
				this.clientWindow.restore();
			this.clientWindow.focus();
		}
	}
}
