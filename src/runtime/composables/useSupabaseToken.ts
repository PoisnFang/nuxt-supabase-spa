import { useRuntimeConfig } from "#imports";
import { Session } from "@supabase/supabase-js";

export const useSupabaseToken = () => {
  const {
    supabase: { client: clientOptions },
  } = useRuntimeConfig().public;
  const storageKey = `${clientOptions.auth.storageKey}`;
  let token = ref<string | null>("");
  const sessionString = localStorage.getItem(storageKey);
  if (sessionString) {
    const session: Session = JSON.parse(sessionString);
    token.value = session.access_token;
  }
  return token;
};
