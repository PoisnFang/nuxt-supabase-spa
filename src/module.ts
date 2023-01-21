import { fileURLToPath } from "url";
import { defineNuxtModule, addPlugin, createResolver } from "@nuxt/kit";
import { CookieOptions, RedirectOptions } from "./runtime/types";
import type { SupabaseClientOptions } from "@supabase/supabase-js";
import { defu } from "defu";

export interface ModuleOptions {
  /**
   * Supabase API URL
   * @default process.env.SUPABASE_URL
   * @example 'https://*.supabase.co'
   * @type string
   * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
   */
  url: string;

  /**
   * Supabase Client API Key
   * @default process.env.SUPABASE_KEY
   * @example '123456789'
   * @type string
   * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
   */
  key: string;

  /**
   * Supabase Service key
   * @default process.env.SUPABASE_SERVICE_KEY
   * @example '123456789'
   * @type string
   * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
   */
  serviceKey: string;

  /**
   * Redirection options
   * @default false
   * @type object | boolean
   */
  redirect?: RedirectOptions | boolean;

  /**
   * Supabase Client options
   * @default {}
   * @type object
   * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
   */
  client?: SupabaseClientOptions<String>;

  /**
   * Supabase Client options
   * @default {
      name: 'sb',
      lifetime: 60 * 60 * 8,
      domain: '',
      path: '/',
      sameSite: 'lax'
    }
   * @type object
   */
  cookies?: CookieOptions;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "@poisnfang/nuxt-supabase-spa",
    configKey: "supabase-spa",
    compatibility: {
      nuxt: "^3.0.0-rc.8",
    },
  },
  defaults: {
    url: process.env.SUPABASE_URL as string,
    key: process.env.SUPABASE_KEY as string,
    serviceKey: process.env.SUPABASE_SERVICE_KEY as string,
    client: {},
    redirect: false,
    cookies: {
      name: "sb",
      lifetime: 60 * 60 * 8,
      domain: "",
      path: "/",
      sameSite: "lax",
    },
  },
  setup(options, nuxt) {
    if (options.addPlugin) {
      const { resolve } = createResolver(import.meta.url);

      // Public runtimeConfig
      nuxt.options.runtimeConfig.public.supabase = defu(
        nuxt.options.runtimeConfig.public.supabase,
        {
          url: options.url,
          key: options.key,
          client: options.client,
          redirect: options.redirect,
          cookies: options.cookies,
        }
      );

      // Private runtimeConfig
      nuxt.options.runtimeConfig.supabase = defu(
        nuxt.options.runtimeConfig.supabase,
        {
          serviceKey: options.serviceKey,
        }
      );
      const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));
      nuxt.options.build.transpile.push(runtimeDir);
      addPlugin(resolve(runtimeDir, "plugins", "supabase.client"));
    }
  },
});
