import { fail, redirect } from '@sveltejs/kit';
import { summarizeCode } from '../api/summarizer';
import { Store, Summaries } from './SummaryStore';
import { checkAdmin } from '../api/admin';


export async function load({cookies}) {
  const username = cookies.get('username');
  const token = cookies.get('token');
  let isAdmin = await checkAdmin(username,token)
  return {isAdmin:isAdmin};
}

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
