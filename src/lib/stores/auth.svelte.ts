import type { UserInfo } from '$lib/types/user';
import { getContext, setContext } from 'svelte';

export const PROTECTED_USER_KEY = Symbol('PROTECTED_USER');

export class UserState {
	currentUser = $state<UserInfo>()!;
	constructor(initialUser: UserInfo) {
		this.currentUser = initialUser;
	}
	setUser = (newUser: UserInfo) => {
		this.currentUser = newUser;
	};
	update(fields: Partial<UserInfo>) {
		this.currentUser = { ...this.currentUser, ...fields };
	}
}

export function setProtectedUser(user: UserInfo): UserState {
	const userState = new UserState(user);
	setContext(PROTECTED_USER_KEY, userState);
	return userState;
}

export function useUser(): UserState {
	const userState = getContext<UserState>(PROTECTED_USER_KEY);
	if (!userState) {
		throw new Error('useUser() must be called within a protected route.');
	}
	return userState;
}