import { template, templateSettings } from 'lodash-es'
import { Plugin } from 'vite'
import fs from 'fs'
import { resolve } from 'pathe'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { version } = require('../package.json')

export enum FileNamesEnum {
    SERVER_HTML = 'weavr-server-v2.html',
    SERVER_ENTRY = 'weavr-server-v2.js',
    CLIENT_ENTRY = 'weavr-client-v2.js'
}

// Fix "__dirname is not defined in ES module scope"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dir = {
    env: resolve(__dirname, '../'),
    src: resolve(__dirname, '../src'),
    dist: resolve(__dirname, '../dist'),
    client: {
        root: undefined,
        entry: undefined
    },
    server: {
        root: undefined,
        entry: undefined,
        html: undefined,
        css: undefined
    }
}

dir.client.root = resolve(dir.src, 'client')
dir.client.entry = resolve(dir.client.root, 'client.ts')
dir.server.root = resolve(dir.src, 'server')
dir.server.entry = resolve(dir.server.root, 'server.ts')
dir.server.html = resolve(dir.server.root, 'index.html')
dir.server.css = resolve(dir.server.root, 'styles.css')

const bundleHTML = (
    html: string,
    isProd?: boolean
) => {
    // Interpolation for mustache template {{ }}
    templateSettings.interpolate = /{{([\s\S]+?)}}/g
    const compiledHtml = template(html)
    const moduleSrc = isProd ? FileNamesEnum.SERVER_ENTRY : dir.server.entry


    const data = {
        injectScript: `<script type='module' src='${moduleSrc}' charset='utf-8'></script>`,
        injectStyle: `<style> ${inlineCSS(dir.server.css)} </style>`,
        title: `Weavr Secure Components v${version}`
    }

    html = compiledHtml(data)

    return html
}

/**
 * @description Hook with Vite transformIndexHtml to transform HTML using lodash
 * templates. Used in DEV only.
 *
 * @return Vite Plugin to bundle HTML and inject EJS like syntax.
 */
const htmlPlugin = () => {
    return {
        name: 'html-transform',
        enforce: 'pre',
        transformIndexHtml: {
            enforce: 'pre',
            async transform(
                code,
                ctx
            ) {
                return bundleHTML(code)
            }
        }
    } as Plugin
}


const inlineCSS = (path) => {
    return fs.readFileSync(path, 'utf-8')
}

export { htmlPlugin, bundleHTML, dir, __dirname }
