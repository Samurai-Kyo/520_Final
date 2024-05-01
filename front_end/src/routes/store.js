/**
 * This file is used to store the session data of the user.
 */
class Session {
	constructor() {
		this.isAdmin = false;
        this.username = '';
		this.token = 0;
	}

	getUsername() {
		return this.username;
	}

	/**
	 * @param {string} username
	 */
	setUsername(username) {
		this.username = username;
	}

	getIsAdmin() {
		return this.isAdmin;
	}

	/**
	 * @param {boolean} isAdmin
	 */
	setIsAdmin(isAdmin) {
		this.isAdmin = isAdmin;
	}

	getToken() {
		return this.token;
	}

	/**
	 * @param {number} token
	 */
	setToken(token) {
		this.token = token;
	}
}

import { writable } from 'svelte/store';

const userSession = writable(new Session());

export default userSession;
