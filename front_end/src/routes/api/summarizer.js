/**
 * @param {string} username
 * @param {string} token
 * @param {string} code
 * @param {string} codingLanguage
 * @param {string} models
 * @returns {Promise<[{summary: string, model: string}]>}
 */
export async function summarizeCode(
	username,
	token,
	code,
	codingLanguage,
	models = 'gpt-4-turbo,gpt-3.5-turbo,claude-3-opus-20240229,claude-3-haiku-20240307'
) {
	try {
		const response = await fetch(`http://localhost:3000/summarize/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				username: username,
				token: token
			},
			body: JSON.stringify({ code: code, codingLanguage: codingLanguage, models: models })
		});
		if (response.ok) {
			const data = await response.json(); 
			console.log('summarizer.js -> data: ' + data);
			const remappedData = data.map((/** @type {{ text: string; model: string; }} */ summary) => {
				return { summary: summary.text, model: summary.model};
			});
			// console.log('summarizer.js -> remappedData: ');
			// console.log(remappedData);
			return remappedData;
		} else {
			console.log('Summary failed');
			return [{ summary: '', model: '' }];
		}
	} catch (error) {
		console.log('Summary failed - ' + error);
		return [{ summary: '', model: '' }];
	}
}

/**
 * @param {string} username
 * @param {string} token
 * @param {string} code
 * @param {any} summary
 */
export async function createReview(username, token, code, summary) {
	const evaluation = {
		naturalRating: summary.nScore,
		usefulRating: summary.uScore,
		consistentRating: summary.cScore,
		evaluationText: summary.evalText
	};
	const apiData = {
		model: summary.apiName,
		text: summary.summary
	};
	try {
		const response = await fetch(`http://localhost:3000/uploadSummarization/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				username: username,
				token: token
			},
			body: JSON.stringify({ code: code, completions: [apiData], ratings: [evaluation] })
		});
		if (!response.ok) {
			return false;
		} 
		return true;
	} catch (error) {
		console.log('Review upload failed - ' + error);
	}
}

// const username = req.headers.username;
// const token = req.headers.token;
// const code = req.body.code;
// const models = req.body.models.split(",");
