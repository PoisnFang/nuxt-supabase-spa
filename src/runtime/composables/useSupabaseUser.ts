import type { Ref } from 'vue';
import { User } from '@supabase/supabase-js';
import { useSupabaseToken } from './useSupabaseToken';
import { useState } from '#imports';

export const useSupabaseUser = (): Ref<User | null> => {
	const user = useState<User | null>('supabase_user');
	const token = useSupabaseToken();

	// Check token and set user to null if not set (check for token expiration)
	if (!token.value) {
		user.value = null;
	}
	//console.log('useSupabaseUser: token', user.value);

	return user;
};
