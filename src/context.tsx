import React, { createContext, useReducer, Dispatch } from 'react';
import { UserData } from './responses/UserData';

const initialGlobalState = {
	user: undefined,
};
export interface GlobalState {
	user: UserData | undefined;
}

export enum ActionType {
	SetUser = 'SET_USER',
}
interface IAction {
	type: ActionType;
	payload: any;
}

const AppContext = createContext<{
	state: GlobalState;
	dispatch: Dispatch<IAction>;
}>({
	state: initialGlobalState,
	dispatch: () => null,
});

const mainReducer: React.Reducer<GlobalState, IAction> = (state, action) => {
	switch (action.type) {
		case ActionType.SetUser:
			state.user = action.payload;
			return state;
		default:
			throw new Error();
	}
};

const AppProvider: React.FC = ({ children }) => {
	const [state, dispatch] = useReducer<React.Reducer<GlobalState, IAction>>(mainReducer, initialGlobalState);
	return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export { AppProvider, AppContext };
