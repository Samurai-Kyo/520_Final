/**
 * @param {string} username
 * @param {string} token
 * @param {{code: string, completions: {model: string, text: string}[], ratings: {naturalRating: number, usefulRating: number, consistentRating: number, favorite: boolean, userNotes: string}[]}} summary
 */
export async function uploadSummarization(username, token, summary) {
	try {
		const response = await fetch(`http://localhost:3000/uploadSummarization/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				username: username,
				token: token
			},
			body: JSON.stringify(summary)
		});
		if (!response.ok) {
			return false;
		}
		return true;
	} catch (error) {
		console.log('File upload failed - ' + error);
	}
}
