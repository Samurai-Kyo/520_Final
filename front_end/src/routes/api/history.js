/**
 * @param {string} username
 * @param {string} token
 */
export async function fetchHistory(username, token) {
	try {
		const response = await fetch(`http://localhost:3000/getSummarizations/`, {
			method: 'Get',
			headers: {
				username: username,
				token: token
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
