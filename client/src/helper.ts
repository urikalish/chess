export class Helper {
	static getRandomNumber(min: number, max: number) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static getTimeStr(time: number) {
		const totalSecs = Math.trunc(time / 1000);
		const hours = Math.trunc(totalSecs / 3600);
		const totalMinutes = totalSecs - hours * 3600;
		const minutes = Math.trunc(totalMinutes / 60);
		const secs = totalMinutes - minutes * 60;
		const hh = hours >= 10 ? hours : '0' + hours;
		const mm = minutes >= 10 ? minutes : '0' + minutes;
		const ss = secs >= 10 ? secs : '0' + secs;
		return `${hh}:${mm}:${ss}`;
	}
}
