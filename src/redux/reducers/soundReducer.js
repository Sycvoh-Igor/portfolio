import { SOUND_ON, SOUND_OFF } from 'redux/actions/soundActions';

const initialState = {
	isMuted : false
};

export default function (state = initialState, action) {
	switch (action.type) {
	case SOUND_ON:
		return { isMuted : false };

	case SOUND_OFF:
		return { isMuted : true };

	default:
		return state;
	}
}