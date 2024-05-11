import { fail, redirect } from '@sveltejs/kit';
import { summarizeCode } from '../api/summarizer';
import { Store, Summaries } from './SummaryStore';
import { checkAdmin,getUsers } from '../api/admin';
import { register } from '../api/login';


export async function load({cookies}) {
  const username = cookies.get('username');
  const token = cookies.get('token');
  const isAdmin = await checkAdmin(username,token)
  const userList = await getUsers(username,token);
  const firstTimeAdmin = cookies.get('firstTimeAdmin')
  return {isAdmin:isAdmin, username:username, token:token,userList:userList.userList, firstTimeAdmin:firstTimeAdmin};
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
	},
	register: async ({ cookies, request }) => {
		const data = await request.formData();
		const username = data.get('Username');
		const password = data.get('Password');
		if (!username || !password) {
			return fail(400, { missing: true });
		}
		// @ts-ignore
		const response = await register(username, password,0);
		if (response) {
      return {success:true}
		} else {
      return fail(400,{taken:true})
		}
	}
};
