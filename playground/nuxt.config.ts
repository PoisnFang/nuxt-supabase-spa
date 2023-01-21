import { defineNuxtConfig } from "nuxt/config";
import type { SupabaseClientOptions } from "@supabase/supabase-js";
import SupabaseSpaModule from "..";

export default defineNuxtConfig({
  modules: [SupabaseSpaModule],
  myModule: {
    addPlugin: true,
  },
  runtimeConfig: {
    public: {
      supabase: {
        url: process.env.SUPABASE_URL as string,
        key: process.env.SUPABASE_KEY as string,
        redirect: false,
        cookies: {
          name: "sb",
          lifetime: 60 * 60 * 8,
          domain: "",
          path: "/",
          sameSite: "lax",
        },
        client: {
          auth: {
            storageKey: "sb-xxx-auth-token",
          },
        } as SupabaseClientOptions<String>,
      },
    },
  },
});
