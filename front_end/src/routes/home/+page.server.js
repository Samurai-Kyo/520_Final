import { fail, redirect } from '@sveltejs/kit';
import { summarizeCode } from '../api/summarizer';
import { Store } from './store';

export const actions = { 
	Summarize: async ({cookies, request}) => {
	console.log('Summarize');
	const data = await request.formData();
	const code = data.get('Code');
	const codeLanguage = data.get('Language');
	if (!code || !codeLanguage) {
		return fail(400, { error: 'Enter the code you want translated.' });
	}
	const username = cookies.get('username');
	const token = cookies.get('token');
	// @ts-ignore
	const response = await summarizeCode(username, token, code, codeLanguage);
	Store.update((summaries) => {
		response.forEach((summary) => {
			summaries.addSummary(summary);
		});
		return summaries;
	});
}
}
export function load({ cookies }) {
	if (!cookies.get('username')) {
		throw redirect(307, '/login');
	}
	const isAdmin = cookies.get('isAdmin');
	return { isAdmin };
}
