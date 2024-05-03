import { fail, redirect } from '@sveltejs/kit';
import { summarizeCode } from '../api/summarizer';
import { Store, Summaries } from './SummaryStore';

export const actions = {
	summarize: async ({ cookies, request }) => {
		console.log('Summarize');

		const data = await request.formData();
		const code = data.get('code');
		const codeLanguage = data.get('codeLanguage');
		if (!code || !codeLanguage) {
			return fail(400, { error: 'Enter the code you want translated.' });
		}

		const username = cookies.get('username');
		const token = cookies.get('token');
		// @ts-ignore
		const response = await summarizeCode(username, token, code, codeLanguage);

		// Replace old summaries
		let newSummaries = new Summaries();
		response.forEach((summary) => {
			newSummaries.addSummary(summary);
		});
		Store.set(newSummaries);
		return true;
	}
};

export function load({ cookies }) {
	if (!cookies.get('username')) {
		throw redirect(307, '/login');
	}
	const isAdmin = cookies.get('isAdmin') || "";
	const username = cookies.get('username') || "";
	const token = cookies.get('token') || "";
	return { isAdmin, username, token };
}
