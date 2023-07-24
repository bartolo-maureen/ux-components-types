import {build, LibraryFormats, LibraryOptions, PluginOption} from 'vite'
import { bundleHTML, dir, FileNamesEnum } from './build-plugins'
import { rollupPluginHTML } from '@web/rollup-plugin-html'
import del from 'rollup-plugin-delete'
import fs from 'fs'
import { visualizer } from 'rollup-plugin-visualizer'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { version } = require('../package.json')

const packageVersion = `ux-components@${version}`
const latestVersion = `ux-components@^${version.charAt(0)}`;

const versions = [
    packageVersion,
    latestVersion
]

// empty dist before build
await fs.rmSync(dir.dist, { recursive: true, force: true });


// entries
const entries: LibraryOptions[] = [
    {
        entry: dir.client.entry,
        name: 'weavrClient'
    },
    {
        entry: dir.server.entry,
        name: 'weavrServer'
    }
]

const formats: LibraryFormats[] = [ 'iife' ]

/**
 * Loop in entries for each entry. This is necessary since atm vite
 * does not support multiple iife entries. This PR might solve the issues
 * https://github.com/vitejs/vite/pull/10609
**/
function jsBuild(versionName?, dirRoot?) {
    entries.forEach(async (libItem) => {
        await build({
            root: dir.src,
            build: {
                rollupOptions: {
                    output: {
                        banner: `/*! \n Weavr ${packageVersion} \n */`,
                    },
                },
                outDir: dir.dist,
                sourcemap: 'hidden',
                lib: {
                    ...libItem,
                    formats: formats,
                    fileName: (
                        format,
                        entryName
                    ) => {
                        return dirRoot ? `weavr-${entryName}-v2.js` : `${versionName}/${format}/weavr-${entryName}-v2.js`
                    }
                },
                emptyOutDir: false
            },
            resolve: {
                alias: {
                    '@': dir.src
                }
            },
            plugins:[
                visualizer({
                    title: 'UX Components Statistics',
                    filename: `./reports/stats-${libItem.name}.html`, // The filename for the generated HTML file
                    sourcemap: true, // Whether to include sourcemaps in the statistics
                    gzipSize: true // Whether to include gzipped sizes in the statistics
                }) as PluginOption
            ],
            envDir: dir.env
        })
    })
}

versions.forEach(async (versionName) => {
    await jsBuild(versionName)
})

await jsBuild(undefined, true)

async function htmlBuild(versionName?, formatItem?, dirRoot?) {
    await build({
        root: dir.src,
        build: {
            outDir: dirRoot ? dir.dist : `${dir.dist}/${versionName}/${formatItem}`,
            rollupOptions: {
                plugins: [
                    rollupPluginHTML({
                        input: {
                            path: dir.server.html,
                            name: FileNamesEnum.SERVER_HTML
                        },
                        minify: true,
                        transformHtml: [(html) => bundleHTML(html, true)]
                    }),
                    // del is used to remove rollup plugin html blank entry module which is unnecessary to bundle
                    del({
                        targets: dirRoot ? 'dist/assets/' : `dist/${versionName}/${formatItem}/assets`,
                        verbose: true,
                        hook: 'closeBundle'
                    })
                ]
            }
        },
        envDir: dir.env,
    })
}

/**
 * The next build is necessary to build the HTML in a seperate build process
 */
versions.forEach((versionName) => {
    formats.forEach(async (formatItem) => {
        await htmlBuild(versionName, formatItem)
    })
})

await htmlBuild(undefined, undefined, true)


