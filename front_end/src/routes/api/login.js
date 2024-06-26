/**
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{isAdmin: boolean, token: number, firstTimeAdmin:boolean}>}
 */
export async function login(username, password) {
	try {
		const response = await fetch(`http://localhost:3000/login`, {
			method: 'GET',
			headers: {
				username: username,
				password: password
			}
		});
		if (response.ok) {
			const data = await response.json();
			return { isAdmin: true, token: data.token, firstTimeAdmin: data.firstTimeAdmin };
		} else {
			console.log('Login failed');
			return { isAdmin: false, token: 0, firstTimeAdmin: false };
		}
	} catch (error) {
		console.log(error);
		return { isAdmin: false, token: 0, firstTimeAdmin: false };
	}
}

/**
 * @param {string} username
 * @param {string} password
 *  @param {string} token
 */
export async function register(username, password, token) {
	try {
		const response = await fetch('http://localhost:3000/createAccount/', {
			method: 'GET',
			headers: {
				newUserName: username,
				newPassword: password,
				token: token.toString(),
				newAdmin: 'false'
			}
		});
		console.log(response);
		if (response.ok) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		console.log(error);
		return false;
	}
}

// /**
//  * @param {string} username
//  * @param {string} password
//  * @param {string} newPassword
//  */
// export async function changePassword(username, password, newPassword) {
// 	try {
// 		const response = await fetch('http://localhost:3000/changePassword/', {
// 			method: 'PUT',
// 			body: JSON.stringify({ username, password, newPassword }),
// 			headers: {
// 				'content-type': 'application/json'
// 			}
// 		});
// 		if (response.ok) {
// 			return true;
// 		} else {
// 			return false;
// 		}
// 	} catch (error) {
// 		console.log(error);
// 		return false;
// 	}
// }
