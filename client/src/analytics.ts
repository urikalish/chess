export enum AnalyticsCategory {
	GAME_PHASE = 'game-phase',
}
export enum AnalyticsAction {
	GAME_STARTED = 'game-started',
	GAME_ENDED = 'game-ended',
}

export class Analytics {
	static sendEvent(event_category: AnalyticsCategory, event_action: AnalyticsAction, event_label = '') {
		window['gtag']('event', event_action as string, {
			event_category: event_category as string,
			event_label: event_label ? event_label.trim() : (event_action as string),
		});
	}
}
