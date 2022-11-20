import merge from 'deepmerge';
import { createBasicConfig } from '@open-wc/building-rollup';
import json from '@rollup/plugin-json';

export default merge(
createBasicConfig({
    legacyBuild: false,
    developmentMode: process.env.ROLLUP_WATCH === 'true',
    injectServiceWorker: false,
    terser: process.env.build === 'production',
    babel: process.env.build === 'production',
}),
{
    input: './tsc/src/bots/bot-worker.js',
    output: [
        {
            format: 'iife',
            file: process.env.build === 'production' ? './public/js/bot-worker.min.js' : './public/js/bot-worker.js',
            sourcemap: process.env.build === 'production'

        },
    ],
    plugins: [json()]
}
);
