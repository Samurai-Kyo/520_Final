/**
 * @param {string} username
 * @param {string} token
 * @param {string} code
 * @param {Array<string>} models
 * @returns {Promise<[{summary: string, model: string}]>}
 */
export async function summarizeCode(
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
			body: JSON.stringify([{ code: code, models: models.join(",") }])
		});
		if (response.ok) {
			const data = await response.json();
			const remappedData = data.map((/** @type {{ text: string; model: string; }} */ summary) => {
				return { summary: summary.text, model: summary.model };
			});
			console.log('summarizer.js -> remappedData: ');
			console.log(remappedData);
			return remappedData;
		} else {
			alert('Summary failed');
			return [{ summary: '', model: '' }];
		}
	} catch (error) {
		console.log(error);
		return [{ summary: '', model: '' }];
	}
}

// const username = req.headers.username;
// const token = req.headers.token;
// const code = req.body.code;
// const models = req.body.models.split(",");
