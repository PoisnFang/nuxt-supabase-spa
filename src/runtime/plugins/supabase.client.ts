import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { defineNuxtPlugin } from '#imports';

export default defineNuxtPlugin(async (nuxtApp) => {
	const user = useSupabaseUser();
	const client = useSupabaseClient();

	// If user has not been set on server side (for instance in SPA), set it for client
	//console.log('start user', user.value);

	if (!user.value) {
		const token = useSupabaseToken();
		//console.log('start token', token.value);
		if (token.value) {
			const {
				data: { user: supabaseUser },
				error
			} = await client.auth.getUser(token.value);

			if (error) {
				token.value = null;
				user.value = null;
				console.error('Error getting user from token', error);
			} else {
				//console.log('user sett', user.value);
				user.value = supabaseUser;
			}
		}
	}

	// Once Nuxt app is mounted
	nuxtApp.hooks.hook('app:mounted', () => {
		//console.log('app:mounted');
		// Listen to Supabase auth changes
		client.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
			const userResponse = session ? await client.auth.getUser() : null;
			//console.log('userResponse', userResponse);
			user.value = userResponse ? userResponse.data.user : null;
		});
	});
});
