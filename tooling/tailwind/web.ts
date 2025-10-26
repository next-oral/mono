import type { Config } from 'tailwindcss';

export default {
    content: [
        // Include all TypeScript/JavaScript files in the mono repo
        '../../apps/**/*.{ts,tsx,js,jsx}',
        '../../packages/**/*.{ts,tsx,js,jsx}',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
} satisfies Config;