import esbuild from "esbuild";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import { spawn, spawnSync } from "child_process";

const prodBuild = process.env.BUILD === 'true'
const target = process.env.TARGET || 'site'
const baseURL = process.env.BASE_URL ? `"${process.env.BASE_URL}"` : (prodBuild ? '"https://demo.lunabrain.com"' : '"http://localhost:8000"')
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
        ".html": "copy",
        ".json": "copy",
        ".ico": "copy",
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
        "process.env.BASE_URL": baseURL,
        "process.env.PRODUCTION": prodBuild ? '"true"' : '"false"'
    },
    entryNames: "[name]",
    logLevel: 'info',
}

const runTailwindBuild = (watch, outfile) => {
    console.log("Building Tailwind CSS...");
    try {
        const command = 'npx';
        const args = [
            'tailwindcss',
            'build',
            '-i', 'site/styles/tailwind.css',
            '-o', outfile
        ];

        if (watch) {
            args.push('--watch')
            spawn(command, args, {
                stdio: 'inherit'
            })
        } else {
            spawnSync(command, args, {
                stdio: 'inherit'
            });
        }
        console.log("Tailwind CSS build successful!");
    } catch (error) {
        console.error("Error building Tailwind CSS:", error.message);
    }
};

async function doBuild(options, serve) {
    // TODO breadchris support tailwind for extension
    if (buildSite) {
        runTailwindBuild(!prodBuild, `${options.outdir}/tailwind.css`);
    }
    if (prodBuild) {
        await esbuild.build(options);
    } else {
        try {
            const context = await esbuild
                .context(options);

            await context.rebuild()
            if (serve) {
                console.log('serving', `${buildDir}/site`)
                context.serve({
                    port: 8001,
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
            "./site/index.tsx",
            "./site/styles/globals.css",
            "./site/favicon.ico",
            "./site/index.html",
        ],
        outdir: `${buildDir}/site/`,
    }, true);
}

if (buildExtension) {
    await doBuild({
        ...baseOptions,
        entryPoints: [
            "./extension/content.tsx",
            "./extension/tab.tsx",
            "./extension/options.tsx",
            "./extension/background.tsx",
            "./extension/options.html",
            "./extension/tab.html",
            "./extension/manifest.json",
        ],
        outdir: `${buildDir}/extension/`,
    }, false);
}
