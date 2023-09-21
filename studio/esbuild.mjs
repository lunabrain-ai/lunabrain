import esbuild from "esbuild";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

const prodBuild = process.env.BUILD === 'true'

const watch = !prodBuild ? {
    onRebuild: () => {
        console.log("rebuilt!");
    },
} : undefined;

const minify = prodBuild;

const nodeEnv = prodBuild ? "'production'" : "'development'";
const options = {
    entryPoints: [
        "./src/index.tsx",
        "./src/styles/globals.css",
    ],
    outdir: "public/build/",
    bundle: true,
    loader: {
        ".ts": "tsx",
        ".tsx": "tsx",
        ".woff2": "file",
        ".woff": "file",
    },
    plugins: [
        // TODO breadchris use swc over tsc
        // swcPlugin(),
        NodeModulesPolyfillPlugin(),
    ],
    minify: false,
    sourcemap: "linked",
    define: {
        "global": "window",
    },
    logLevel: 'info'
};

if (prodBuild) {
    await esbuild.build(options);
} else {
    try {
        const context = await esbuild
            .context(options);

        await context.rebuild()
        context.serve({
            servedir: 'public',
        })
        await context.watch()
    } catch (e) {
        console.error('failed to build: ' + e)
    }
}
