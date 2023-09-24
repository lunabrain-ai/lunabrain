import esbuild from "esbuild";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

const prodBuild = process.env.BUILD === 'true'
const target = process.env.TARGET || 'studio'

const baseOptions = {
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
}

async function doBuild(options, serve) {
    if (prodBuild) {
        await esbuild.build(options);
    } else {
        try {
            const context = await esbuild
                .context(options);

            await context.rebuild()
            if (serve) {
                context.serve({
                    servedir: 'public',
                })
            }
            await context.watch()
        } catch (e) {
            console.error('failed to build: ' + e)
        }
    }
}

if (target === 'extension') {
    await doBuild({
        ...baseOptions,
        entryPoints: [
            "./src/extension/content.tsx",
            "./src/extension/background.tsx",
            "./src/extension/styles.css",
        ],
        outdir: "extension/",
    });
} else if (target === 'studio') {
    await doBuild({
        ...baseOptions,
        entryPoints: [
            "./src/index.tsx",
            "./src/styles/globals.css",
        ],
        outdir: "public/build/",
    }, true);
}
