//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "src",
  experimental: {
    asyncContext: true,
    openAPI: true,
  },
});
