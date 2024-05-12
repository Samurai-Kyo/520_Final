import { Summary, Rating } from '../home/SummaryStore';

/**
 * @param {string} username
 * @param {string} token
 * @param {string} code
 * @param {string} codingLanguage
 * @param {string} models
 * @returns {Promise<{summaries:[{summary: string, model: string}], summariesID: number}>}
 */
export async function summarizeCode(
	username,
	token,
	code,
	codingLanguage,
	reviewCount,
	models = ['gpt-4-turbo', 'gpt-3.5-turbo', 'claude-3-opus-20240229', 'claude-3-haiku-20240307']
) {
	let modelString = 'gpt-4-turbo';
	for (let i = 1; i < reviewCount; i++) {
		modelString += ',' + models[i % 4];
	}
	console.log('summarizer.js -> modelString: ' + modelString);

	try {
		const response = await fetch(`http://localhost:3000/summarize/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				username: username,
				token: token
			},
			body: JSON.stringify({ code: code, codingLanguage: codingLanguage, models: modelString })
		});
		if (response.ok) {
			const data = await response.json();
			console.log('summarizer.js -> data: ' + data);
			const id = data[data.length - 1].id;
			const remappedData = data
				.filter((/** @type {{ text: string; model: string; }} */ summary) => summary.text)
				.map((/** @type {{ text: string; model: string; }} */ summary) => {
					return { summary: summary.text, model: summary.model };
				});
			// console.log('summarizer.js -> remappedData: ');
			// console.log(remappedData);
			return {summaries:remappedData, summariesID: id};
		} else {
			console.log('Summary failed');
			return {summaries:[{ summary: '', model: ''}], summariesID: 0 };
		}
	} catch (error) {
		console.log('Summary failed - ' + error);
		return {summaries:[{ summary: '', model: ''}], summariesID: 0 };
	}
}

/**
 * @param {string} username
 * @param {string} token
 * @param {Rating[]} ratings
 * @param {number} id
 */
export async function createReview(username, token, id, ratings) {
	let remappedRatings = ratings.map((rating) => { 
		return {"naturalRating":rating.nScore, "usefulRating":rating.uScore, "consistentRating":rating.cScore} 
	});
	try {
		const response = await fetch(`http://localhost:3000/setRating/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				username: username,
				token: token,
				id: id.toString()
			},
			body: JSON.stringify({ ratings: remappedRatings})
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
