import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { login, register } from '../api/login';

export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const username = data.get('Username');
		const password = data.get('Password');
		if (!username || !password) {
			return fail(400, { missing: true });
		}

		// @ts-ignore
		const response = await login(username, password);
		if (response.token == 0) {
			return fail(400, { noAccount: true });
		}
		// @ts-ignore
		cookies.set('username', username, { path: '/home' });
		// @ts-ignore
		cookies.set('isAdmin', response.isAdmin, { path: '/home' });
		// @ts-ignore
		cookies.set('token', response.token, { path: '/home' });
		// @ts-ignore
		cookies.set('firstTimeAdmin', response.firstTimeAdmin, { path: '/home' });
		throw redirect(303, '/home');
	},
	register: async ({ cookies, request }) => {
		cookies.set('username', 'placeholder', { path: '/home' });
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
