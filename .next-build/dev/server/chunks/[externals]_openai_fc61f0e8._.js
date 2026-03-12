module.exports = [
"[externals]/openai [external] (openai, esm_import, [project]/node_modules/openai, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/[externals]_openai_e995be8d._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[externals]/openai [external] (openai, esm_import, [project]/node_modules/openai)");
    });
});
}),
];