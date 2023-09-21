// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@sidebase/nuxt-auth",
    "dayjs-nuxt",
    "@pinia/nuxt",
    "@productdevbook/chatwoot",
  ],
  extends: ["nuxt-seo-kit"],
  runtimeConfig: {
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    API_ROUTE_SECRET: process.env.API_ROUTE_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    PRO_MONTHLY_PRICE_ID: process.env.PRO_MONTHLY_PRICE_ID,
    PRO_YEARLY_PRICE_ID: process.env.PRO_YEARLY_PRICE_ID,
    public: {
      FROM_MAIL: process.env.FROM_MAIL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      BASE_URL: process.env.BASE_URL,

      // SEO
      siteUrl: process.env.BASE_URL || "https://openformstack.com",
      siteName: "OpenformStack",
      siteDescription:
        "Open source form backend that allows you to collect form submissions without writing any backend code",
      language: "en",
    },
  },
  pinia: {
    autoImports: ["defineStore", ["defineStore", "definePiniaStore"]],
  },
  colorMode: {
    preference: "light",
  },
  chatwoot: {
    init: {
      websiteToken: process.env.CHATWOOT_WEBSITE_TOKEN,
    },
    settings: {
      locale: "en",
      position: "left",
      launcherTitle: "Chat",
    },
  },
});
