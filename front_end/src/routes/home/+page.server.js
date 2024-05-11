import { fail } from '@sveltejs/kit';
import { checkAdmin, getUsers } from '../api/admin';
import { register } from '../api/login';

export async function load({ cookies }) {
	const username = cookies.get('username') || '';
	const token = cookies.get('token') || '';
	const isAdmin = await checkAdmin(username, token);
	let userList = [];
	if (isAdmin) {
		userList = await getUsers(username, token);
	}
	const firstTimeAdmin = cookies.get('firstTimeAdmin');
	return {
		isAdmin: isAdmin,
		username: username,
		token: token,
		userList: userList.userList,
		firstTimeAdmin: firstTimeAdmin
	};
}

export const actions = {
	register: async ({ cookies, request }) => {
		const data = await request.formData();
		const username = data.get('Username');
		const password = data.get('Password');
		if (!username || !password) {
			return fail(400, { missing: true });
		}
		// @ts-ignore
		const response = await register(username, password, 0);
		if (response) {
			return { success: true };
		} else {
			return fail(400, { taken: true });
		}
	}
};
