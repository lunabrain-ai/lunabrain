import esbuild from "esbuild";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import { spawn, spawnSync } from "child_process";

const releaseBuild = process.env.BUILD === 'true'
const targets = (process.env.TARGETS || '').split(',')
const baseURL = `"${process.env.BASE_URL}"`
const buildDir = releaseBuild ? 'dist' : 'build'

if (process.env.BASE_URL === undefined) {
    throw new Error('BASE_URL is not defined')
}

if (targets.length === 0) {
    throw new Error('TARGETS is not defined')
}

const buildExtension = targets.some(t => t === 'extension') || releaseBuild
const buildSite = targets.some(t => t === 'site') || releaseBuild
const buildStream = targets.some(t => t === 'stream');

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
    minify: releaseBuild || buildStream,
    sourcemap: 'both',
    define: {
        "global": "window",
        "process.env.BASE_URL": baseURL,
        "process.env.PRODUCTION": releaseBuild ? '"true"' : '"false"'
    },
    entryNames: "[name]",
    logLevel: 'info',
}

const runTailwindBuild = (target, watch, outfile) => {
    console.log(`[${target}] building Tailwind CSS...`);
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
        console.log(`[${target}] CSS build successful!`);
    } catch (error) {
        console.error("Error building Tailwind CSS:", error.message);
    }
};

async function doBuild(target, options, port) {
    // TODO breadchris support tailwind for extension
    if (buildSite||buildStream) {
        runTailwindBuild(target, !releaseBuild, `${options.outdir}/tailwind.css`);
    }
    if (releaseBuild) {
        await esbuild.build(options);
    } else {
        try {
            const context = await esbuild
                .context(options);

            await context.rebuild()
            if (port !== undefined) {
                console.log('serving', options.outdir)
                context.serve({
                    port: port,
                    servedir: options.outdir,
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

await Promise.all([
    buildSite && doBuild('site', {
        ...baseOptions,
        entryPoints: [
            "./site/index.tsx",
            "./site/styles/globals.css",
            "./site/favicon.ico",
            "./site/index.html",
        ],
        outdir: `${buildDir}/site/`,
    }, 8001),
    buildStream && doBuild('stream', {
        ...baseOptions,
        entryPoints: [
            "./site/index.tsx",
            "./site/styles/globals.css",
            "./site/favicon.ico",
            "./site/index.html",
        ],
        outdir: `${buildDir}/stream/`,
    }, 9001),
    buildExtension && doBuild('extension', {
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
    })
])