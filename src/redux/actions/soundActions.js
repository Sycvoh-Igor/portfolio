export const SOUND_ON = 'SOUND_ON';
export const SOUND_OFF = 'SOUND_OFF';

export function setSoundOn() {
	return { type: SOUND_ON };
}

export function setSoundOff() {
	return { type: SOUND_OFF };
}