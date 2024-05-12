/**
 * @param {string} username
 * @param {string} token
 * @param {string} targetUserName
 */
export async function fetchHistory(username, token, targetUserName = '') {
	try {
		const response = await fetch(`http://localhost:3000/getSummarizations/`, {
			method: 'GET',
			headers: {
				username: username,
				token: token,
				targetUserName: targetUserName
			},
		});
		if (!response.ok) {
			return [];
		}
		return await response.json();
	} catch (error) {
		console.log('History fetch failed - ' + error);
	}
}
