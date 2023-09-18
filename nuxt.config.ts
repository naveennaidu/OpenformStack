// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@sidebase/nuxt-auth", "dayjs-nuxt", "@pinia/nuxt"],
  extends: ["nuxt-seo-kit"],
  runtimeConfig: {
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    API_ROUTE_SECRET: process.env.API_ROUTE_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    public: {
      FROM_MAIL: process.env.FROM_MAIL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      BASE_URL: process.env.BASE_URL,

      // SEO
      siteUrl: process.env.BASE_URL || "https://openformstack.com",
      siteName: "OpenformStack",
      siteDescription: "Open Source Backend Form",
      language: "en",
    },
  },
  pinia: {
    autoImports: ["defineStore", ["defineStore", "definePiniaStore"]],
  },
  colorMode: {
    preference: "light",
  },
});
