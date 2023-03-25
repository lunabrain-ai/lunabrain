import esbuild from "esbuild";
import sveltePlugin from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import { nodeModulesPolyfillPlugin } from 'esbuild-plugins-node-modules-polyfill';

const prodBuild = process.env.BUILD === 'true'

const watch = !prodBuild ? {
  onRebuild: () => {
    console.log("rebuilt!");
  },
} : undefined;

const minify = prodBuild;

const nodeEnv = prodBuild ? "'production'" : "'development'";

const options = {
      entryPoints: ["./src/main.ts"],
      //mainFields: ["svelte", "browser", "module", "main"],
      outfile: "public/build/bundle.js",
      bundle: true,
      loader: {
        ".ts": "tsx",
        ".tsx": "tsx",
        ".woff2": "file",
        ".woff": "file",
      },
      plugins: [
        nodeModulesPolyfillPlugin(),
        sveltePlugin({
          preprocess: sveltePreprocess(),
        }),
      ],
      minify: false,
      sourcemap: "linked",
      define: {
        "global": "window",
        "process": "{}",
        "process.env": "{}",
        "process.env.NODE_ENV": nodeEnv,
      },
      logLevel: 'info'
    };

if (prodBuild) {
  await esbuild.build(options);
} else {
  const context = await esbuild
    .context(options);

  const result = await context.rebuild()
  await context.watch();
  await context.serve({
    servedir: "public",
  })
}
