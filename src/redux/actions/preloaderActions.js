export const APP_LOADED = 'APP_LOADED';
export const PAGE_LOADED = 'PAGE_LOADED';
export const PAGE_UNLOADED = 'PAGE_UNLOADED';
export const LOADER_SHOW = 'LOADER_SHOW';
export const LOADER_HIDE = 'LOADER_HIDE';
export const LOADER_LINK = 'LOADER_LINK';
export const LOADER_POS = 'LOADER_POS';

export function showPreloader() {
	return { type: LOADER_SHOW };
}

export function isLoadedApp() {
	return { type: APP_LOADED };
}

export function isLoadedPage() {
	return { type: PAGE_LOADED };
}

export function isUnloadedPage() {
	return { type: PAGE_UNLOADED };
}

export function hidePreloader() {
	return { type: LOADER_HIDE };
}

export function setNextPage(link) {
	return { type: LOADER_LINK, link };
}

export function setLoaderPos(data) {
	return { type: LOADER_POS, data };
}