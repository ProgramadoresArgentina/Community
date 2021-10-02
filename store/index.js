import { createStore } from 'redux';


// The types of actions that you can dispatch to modify the state of the store
export const types = {
	SETUSER: 'SETUSER',
	SETHOMEPOST: 'SETHOMEPOST',
	SETPINNEDPOST: 'SETPINNEDPOST'
}

// Helper functions to dispatch actions, optionally with payloads
export const actionCreators = {
	setUser: (user) => {
		return { type: types.SETUSER, payload: user }
	},
	setHomePosts: (posts) => {
		return { type: types.SETHOMEPOST, payload: posts }
	},
	setPinnedPosts: (posts) => {
		return { type: types.SETPINNEDPOST, payload: posts }
	}
}

// Initial state of the store
const initialState = {
	user: null,
	homePosts: [],
	pinnedPosts: [],
}

export const reducer = (state = initialState, action) => {
	const { type, payload } = action

	switch (type) {
		case types.SETUSER: {
			return { ...state, user: payload, }
		}
		case types.SETHOMEPOST: {
			return { ...state, homePosts: payload }
		}
		case types.SETPINNEDPOST: {
			return { ...state, pinnedPosts: payload }
		}
		default: {return state}
	}
}


export const store = createStore(reducer);