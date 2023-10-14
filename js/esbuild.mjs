import esbuild from "esbuild";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

const prodBuild = process.env.BUILD === 'true'
const target = process.env.TARGET || 'site'
const buildDir = prodBuild ? 'dist' : 'build'

const buildExtension = target === 'extension' || prodBuild
const buildSite = target === 'site' || prodBuild

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
        "process.env.BASE_URL": prodBuild ? '"https://demo.lunabrain.com"' : '"http://localhost:8080"',
        "process.env.PRODUCTION": prodBuild ? '"true"' : '"false"'
    },
    entryNames: "[name]",
    logLevel: 'info',
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
                    servedir: `${buildDir}/site`,
                    fallback: `${buildDir}/site/index.html`,
                    onRequest: args => {
                        console.log(args.method, args.path)
                    }
                })
            }
            await context.watch()
        } catch (e) {
            console.error('failed to build: ' + e)
        }
    }
}

if (buildSite) {
    await doBuild({
        ...baseOptions,
        entryPoints: [
            "./src/index.tsx",
            "./src/styles/globals.css",
        ],
        outdir: `${buildDir}/site/build/`,
    }, true);
}

if (buildExtension) {
    await doBuild({
        ...baseOptions,
        entryPoints: [
            "./src/extension/content.tsx",
            "./src/extension/tab.tsx",
            "./src/extension/options.tsx",
            "./src/extension/background.tsx",
        ],
        outdir: `${buildDir}/extension/`,
    }, false);
}
