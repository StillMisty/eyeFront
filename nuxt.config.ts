// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  build: {
    transpile: ["vue"], // 添加 vue 到 transpile 列表
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL || "http://127.0.0.1:8000",
    },
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  css: ["~/assets/css/tailwind.css"],
  modules: ["shadcn-nuxt", "@nuxt/eslint", "@pinia/nuxt"],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  vite: {
    plugins: [tailwindcss()],
  },

  plugins: ["~/plugins/vue-query"],
});
