/**
 * @param {string} username
 * @param {string} token
 * @param {string} adminName
 */
export async function makeAdmin(username, token, adminName) {
	try {
		const response = await fetch(`http://localhost:3000/makeAdmin`, {
			method: 'POST',
			headers: {
				username: username,
				token: token,
				adminName: adminName
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
 * @param {string[]} userList
 **/
export async function getAverageScores(username, token, userList) {
	console.log(userList);
	try {
		const response = await fetch(`http://localhost:3000/stats/`, {
			method: 'Post',
			headers: {
				application: 'application/json',
				username: username,
				token: token
			},
			body: JSON.stringify({ selectedUsers: userList })
		});
		if (response.ok) {
			console.log(response);
			const data = await response.json();
			return data;
		}
		return {};
	} catch (error) {
		console.log(error);
		return {};
	}
}

/**
 * @param {string} username
 * @param {string} token
 * */
export async function checkAdmin(username, token) {
	try {
		const response = await fetch(`http://localhost:3000/checkAdmin`, {
			method: 'GET',
			headers: {
				username: username,
				token: token
			}
		});
		const data = await response.json();
		if (data.isAdmin) {
			return true;
		} else {
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
 * */
export async function getUsers(username, token) {
	try {
		const response = await fetch(`http://localhost:3000/getUsers`, {
			method: 'GET',
			headers: {
				username: username,
				token: token
			}
		});
		if (!response.ok) {
			console.log('Error - getUsers:' + response.statusText);
			return false;
		}
		const data = await response.json();
		// console.log(data);
		return data;
	} catch (error) {
		console.log(error);
		return false;
	}
}

/**
 * @param {string} username
 * @param {string} token
 * @param {string} toDelete
 * */
export async function deleteUser(username, token, toDelete) {
	try {
		const response = await fetch(`http://localhost:3000/deleteUser`, {
			method: 'GET',
			headers: {
				username: username,
				token: token,
				toDelete: toDelete
			}
		});
		if (response.ok) {
			return true;
		} else {
			console.log('error');
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
 * @param {string} newPassword
 * @param {string} targetUsername
 * */
export async function changePassword(username, token, newPassword, targetUsername) {
	try {
		const response = await fetch(`http://localhost:3000/changePassword`, {
			method: 'GET',
			headers: {
				username: username,
				token: token,
				newPassword: newPassword,
				newUsername: targetUsername
			}
		});
		if (response.ok) {
			return true;
		} else {
			console.log('error');
			return false;
		}
	} catch (error) {
		console.log(error);
		return false;
	}
}
