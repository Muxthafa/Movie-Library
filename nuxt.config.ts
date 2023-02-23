// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: ["@/assets/defaults.scss"],
    modules: ['@vueuse/nuxt'],
    app: {
        pageTransition: { name: 'page', mode: 'out-in' }
    },
    runtimeConfig: {
        public:{
            apiSecret: process.env.MOVIES_API_KEY
        }
        
    },
})
