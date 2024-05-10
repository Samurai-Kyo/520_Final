/**
 * @param {string} username
 * @param {string} token
 * @param {string} newAdminName
 */
export async function makeAdmin(username, token, newAdminName) {
	try {
		const response = await fetch(`http://localhost:3000/makeAdmin/`, {
			method: 'POST',
			headers: {
				username: username,
				token: token,
				newAdminName: newAdminName
			}
		});
		if (response.ok) {
			return true;
		} else {
			alert('Could not upgrade to Admin');
			return false;
		}
	} catch (error) {
		console.log(error);
		return false;
	}
}

/**
 * @param {string} username
 * @param {string} token
 * @param {string} newUsername
 * @param {string} newPassword
 */
export async function createUser(username, token, newUsername, newPassword) {
	try {
		const response = await fetch(`http://localhost:3000/createAccount/`, {
			method: 'POST',
			headers: {
				username: username,
				token: token,
				newUsername: newUsername,
				newPassword: newPassword
			}
		});
		if (response.ok) {
			return true;
		} else {
			alert('Could not create user');
			return false;
		}
	} catch (error) {
		console.log(error);
		return false;
	}
}
