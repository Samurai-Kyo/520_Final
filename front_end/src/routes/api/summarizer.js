/**
 * @param {string} username
 * @param {string} token
 *  @param {string} code
 *  @param {Array<string>} models
 * @returns {Promise<{code: Array<string>, models: Array<string>}>}
 */
export async function summerizeCode(
	username,
	token,
	code,
	models = ['gpt-4-turbo', 'gpt-3.5-turbo', 'claude-3-opus-20240229', 'claude-3-haiku-20240307']
) {
	try {
		const response = await fetch(`http://localhost:3000/summarize/`, {
			method: 'POST',
			headers: {
				username: username,
				token: token
			},
			body: JSON.stringify({ code: code, models: models })
		});
		if (response.ok) {
			const data = await response.json();
			return { code: data.code, models: data.models };
		} else {
			alert('Login failed');
			return { code: [], models: [] };
		}
	} catch (error) {
		console.log(error);
		return { code: [], models: [] };
	}
}

// const username = req.headers.username;
// const token = req.headers.token;
// const code = req.body.code;
// const models = req.body.models.split(",");
