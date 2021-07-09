export function getFriendlyDifficultyName(difficulty: string): string {
	if (difficulty.includes('ExpertPlus')) {
		return 'Expert+';
	}
	if (difficulty.includes('Expert')) {
		return 'Expert';
	}
	if (difficulty.includes('Hard')) {
		return 'Hard';
	}
	if (difficulty.includes('Normal')) {
		return 'Normal';
	}
	if (difficulty.includes('Easy')) {
		return 'Easy';
	}
	return '';
}

export function getDifficultyStyle(difficulty: string): string {
	if (difficulty.includes('ExpertPlus')) {
		return 'expert-plus';
	}
	if (difficulty.includes('Expert')) {
		return 'expert';
	}
	if (difficulty.includes('Hard')) {
		return 'hard';
	}
	if (difficulty.includes('Normal')) {
		return 'normal';
	}
	if (difficulty.includes('Easy')) {
		return 'easy';
	}
	return '';
}

export function getFriendlyDifficultyFromId(difficulty: number): string {
	switch (difficulty) {
		case 1:
			return 'Easy';
		case 3:
			return 'Normal';
		case 5:
			return 'Hard';
		case 7:
			return 'Expert';
		case 9:
			return 'Expert+';
		default:
			return 'Expert+';
	}
}

export function getDifficultyStyleFromId(difficulty: number): string {
	switch (difficulty) {
		case 1:
			return 'easy';
		case 3:
			return 'normal';
		case 5:
			return 'hard';
		case 7:
			return 'expert';
		case 9:
			return 'expert-plus';
		default:
			return 'expert-plus';
	}
}

export function getGlobalRankWeekDifference(history: string, currentRank: number) {
	if (currentRank === 0) {
		return 0;
	}
	const historyArray = history.split(',');
	let lastweek: number = 0;

	if (historyArray.length > 6) {
		lastweek = parseInt(historyArray[historyArray.length - 7]);
	} else {
		lastweek = parseInt(historyArray[0]);
	}
	if (lastweek === 999999) {
		return 0;
	}
	const difference = lastweek - currentRank;
	return difference;
}

export function truncateWithEllipses(text: string, max: number) {
	return text.substr(0, max - 1) + (text.length > max ? '...' : '');
}

export function isProd() {
	if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
		return false;
	} else {
		return true;
	}
}

export function rankToPage(rank: number, perPage: number) {
	return Math.floor((rank + perPage - 1) / perPage);
}
