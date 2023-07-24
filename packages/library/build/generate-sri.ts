/*!
 * Script to generate SRI hashes for use in our docs.
 * Remember to use the same vendor files as the CDN ones,
 * otherwise the hashes won't match!
 */

import * as crypto from 'crypto'
import { __dirname, FileNamesEnum } from './build-plugins'
import fs from 'fs'
import path from 'pathe'
import { createRequire } from 'module'
import {LibraryFormats} from "vite";
const require = createRequire(import.meta.url)
const { version } = require('../package.json')

const packageVersion = `ux-components@${version}`

const configFile = path.join(__dirname, '../release.yml')

const formats: LibraryFormats[] = [ 'iife' ]


// Array of objects which holds the files to generate SRI hashes for.
// `file` is the path from the root folder
// `configPropertyName` is the release.yml variable's name of the file
// Array order is important
formats.forEach( (formatItem) => {
    const sriFiles = [
        {
            fileName: FileNamesEnum.SERVER_ENTRY,
            file: `dist/${packageVersion}/${formatItem}/${FileNamesEnum.SERVER_ENTRY}`,
            configPropertyKey: 'server_entry',
            configPropertyHashKey: 'server_entry_hash',
            sri: undefined
        },
        {
            fileName: FileNamesEnum.CLIENT_ENTRY,
            file: `dist/${packageVersion}/iife/${FileNamesEnum.CLIENT_ENTRY}`,
            configPropertyKey: 'client_entry',
            configPropertyHashKey: 'client_entry_hash',
            sri: undefined
        },
        {
            fileName: FileNamesEnum.SERVER_HTML,
            file: `dist/${packageVersion}/${formatItem}/${FileNamesEnum.SERVER_HTML}`,
            configPropertyKey: 'server_html',
            configPropertyHashKey: 'server_html_hash',
            sri: undefined,
            referenceFile: FileNamesEnum.SERVER_ENTRY,
            updateReferenceWithSri: true
        }

    ]


    const sriSync = (file) => {
        try {
            const dataBuffer = fs.readFileSync(file, {encoding: 'utf-8'})
            const algo = 'sha384'
            const hash = crypto.createHash(algo).update(dataBuffer, 'utf8').digest('base64')
            return `${algo}-${hash}`
        } catch (e) {
            throw (e)
        }

    }

    sriFiles.forEach(async (
        {file, fileName, configPropertyHashKey, configPropertyKey, referenceFile, updateReferenceWithSri},
        index
    ) => {

        if (updateReferenceWithSri) {

            // Match - <script type="module" src="weavr-server-v2.js" charset="utf-8" integrity="sha384-..." crossorigin="anonymous"></script>
            // Group 1 - <script type="module" src="weavr-server-v2.js" charset="utf-8" integrity="sha384-...
            // Group 2 - type="module"
            // Group 3 - src="weavr-server-v2.js"
            // Group 4 - weavr-server-v2.js
            // Group 5 - charset="utf-8" integrity="sha384-..." crossorigin="anonymous"
            // Group 6 - ></script>

            const referenceSri = sriFiles.find((file) => file.fileName === referenceFile).sri
            const scriptRegExp = /(<script\s+([^]*)(src="([\w.-]+)")\s+([^]*))(><\/script>)/g
            const sriRegExp = /integrity="[^"]*"/g
            const crossOriginRegExp = /crossorigin="[^"]*"/g

            try {
                let fileContents = fs.readFileSync(file, 'utf8')

                if (scriptRegExp.test(fileContents)) {

                    const scriptTags = fileContents.match(scriptRegExp)
                    scriptTags.forEach((scriptTag) => {
                        const originalTag = scriptTag
                        scriptTag = scriptTag.match(sriRegExp) ? scriptTag.replace(sriRegExp, `integrity="${referenceSri}"`) : scriptTag.replace(scriptRegExp, `$1 integrity="${referenceSri}"$6`)
                        scriptTag = scriptTag.match(crossOriginRegExp) ? scriptTag.replace(crossOriginRegExp, scriptTag.match(crossOriginRegExp)[0]) : scriptTag.replace(scriptRegExp, `$1 crossorigin="anonymous"$6`)
                        fileContents = fileContents.replace(originalTag, scriptTag)
                    })
                    fs.writeFileSync(file, fileContents)
                } else console.error(`No Matching Content to upate SRI in ${file} `)

            } catch (e) {
                throw e
            }

        }

        const sri = sriSync(file)
        const regExpKeyHash = new RegExp(`^(\\s+${configPropertyHashKey}:\\s+["'])\\S*(["'])`, 'm')
        const regExpDir = new RegExp(`^(\\s+${configPropertyKey}:\\s+["'])\\S*(["'])`, 'm')

        try {
            let fileContents = fs.readFileSync(configFile, 'utf8')
            fileContents = fileContents.replace(regExpKeyHash, `$1${sri}$2`).replace(regExpDir, `$1${file}$2`)
            fs.writeFileSync(configFile, fileContents)
        } catch (e) {
            throw e
        }


        sriFiles[index].sri = sri
    })
})
