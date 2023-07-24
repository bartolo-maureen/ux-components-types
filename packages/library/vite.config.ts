import { defineConfig } from 'vite'
import { dir, htmlPlugin } from './build/build-plugins'

export default defineConfig(({ command }) => {

    const isProd = command === 'build'

    return {
        root: dir.src,
        build: {
            outDir: dir.dist,
            sourcemap: isProd ? 'hidden' : true
        },
        plugins: [
            htmlPlugin()
        ],
        resolve: {
            alias: {
                '@': dir.src
            }
        },
        server: {
            port: 8080,
            strictPort: true
        },
        preview: {
            port: 8080,
            strictPort: true
        },
        envDir: dir.env
    }

})



