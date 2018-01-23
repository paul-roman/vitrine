import { remote } from 'electron';
import { localizer } from './Localizer';

function openDialog(options: any): string {
	let dialogRet: string[] = remote.dialog.showOpenDialog(options);
	if (!dialogRet || !dialogRet.length)
		return null;
	return dialogRet[0];
}

export function formatTimePlayed(timePlayed: number): string {
	let hours: number = Math.floor(timePlayed / 3600);
	let minutes: number = Math.floor((timePlayed - (hours * 3600)) / 60);
	let seconds: number = timePlayed - (hours * 3600) - (minutes * 60);


	if (hours && minutes && seconds) {
		let hoursStr: string = localizer.f((hours !== 1) ? ('hoursPlur') : ('hoursSing'));
		let minutesStr: string = localizer.f((minutes) ? ((minutes === 1) ? ('minutesPlur') : ('minutesSing')) : (''));
		return hours + ' ' + hoursStr + ((minutesStr) ? (' ' + minutes + ' ' + minutesStr) : (''));
	}
	else if (minutes && seconds) {
		let minutesStr: string = localizer.f((minutes !== 1) ? ('minutesPlur') : ('minutesSing'));
		return minutes + ' ' + minutesStr;
	}
	else if (seconds) {
		let secondsStr: string = localizer.f((seconds !== 1) ? ('secondsPlur') : ('secondsSing'));
		return timePlayed + ' ' + secondsStr;
	}
	else
		return '';
}

export function openDirectory(): string {
	return openDialog({
		properties: ['openDirectory']
	});
}

export function openExecutableDialog(): string {
	return openDialog({
		properties: ['openFile'],
		filters: [
			{
				name: localizer.f('executables'),
				extensions: ['exe']
			},
			{
				name:localizer.f('allFiles'),
				extensions: ['*']
			}
		]
	});
}

export function openImageDialog(): string {
	return openDialog({
		properties: ['openFile'],
		filters: [
			{
				name: localizer.f('images'),
				extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp']
			}
		]
	});
}

export function urlify(imgPath: string): string {
	return (imgPath) ? ('url(' + imgPath.replace(/\\/g, '\\\\') + ')') : ('');
}
