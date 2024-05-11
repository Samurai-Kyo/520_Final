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


export async function checkAdmin(username,token){
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


export async function getUsers(username,token){
	try {
		const response = await fetch(`http://localhost:3000/getUsers`, {
			method: 'GET',
			headers: {
				username: username,
				token: token
			}
		});
    const data = await response.json();
    console.log(data);
    return data
	} catch (error) {
		console.log(error);
		return false;
	}

}


export async function deleteUser(username,token,toDelete){
	try {
		const response = await fetch(`http://localhost:3000/deleteUser`, {
			method: 'GET',
			headers: {
				username: username,
				token: token,
        toDelete:toDelete
			}
		});
    if(response.ok){
      return true;
    }else{
		console.log("error");
		return false;
    }
	} catch (error) {
		console.log(error);
		return false;
	}

}
export async function changePassword(username,token,newPassword,newUsername){
	try {
		const response = await fetch(`http://localhost:3000/changePassword`, {
			method: 'GET',
			headers: {
				username: username,
				token: token,
        newPassword:newPassword,
        newUsername:newUsername
			}
		});
    if(response.ok){
      return true;
    }else{
		console.log("error");
		return false;
    }
	} catch (error) {
		console.log(error);
		return false;
	}

}
