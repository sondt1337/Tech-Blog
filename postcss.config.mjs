/** @type {import('postcss-load-config').Config} */
const config = {
    plugins: {
        // Fix known flexbox bugs - must run before Tailwind
        'postcss-flexbugs-fixes': {},

        // Enable Tailwind CSS
        tailwindcss: {},

        // Parse CSS and add vendor prefixes using values from Can I Use
        autoprefixer: {
            flexbox: 'no-2009', // Don't prefix old flexbox syntax
            grid: 'autoplace', // Enable Grid Layout prefixes
        },

        // Minify CSS in production
        ...(process.env.NODE_ENV === 'production' ?
            {
                cssnano: {
                    preset: [
                        'default',
                        {
                            discardComments: {
                                removeAll: true,
                            },
                            // Merge identical rules
                            mergeLonghand: true,
                            // Convert colors to shortest possible
                            colormin: true,
                            // Remove duplicate properties
                            discardDuplicates: true,
                            // Remove empty rules and at-rules
                            discardEmpty: true,
                            // Merge adjacent rules by selectors
                            mergeRules: true,
                        },
                    ],
                },
            } :
            {}),

        // Enable nesting like Sass
        'postcss-nested': {},

        // Convert modern CSS into something most browsers can understand
        'postcss-preset-env': {
            autoprefixer: {
                flexbox: 'no-2009',
            },
            stage: 3,
            features: {
                'custom-properties': false,
                'nesting-rules': true,
            },
        },

        // Add PurgeCSS in production to remove unused CSS
        ...(process.env.NODE_ENV === 'production' ?
            {
                '@fullhuman/postcss-purgecss': {
                    content: [
                        './src/pages/**/*.{js,jsx,ts,tsx}',
                        './src/components/**/*.{js,jsx,ts,tsx}',
                        './src/layouts/**/*.{js,jsx,ts,tsx}',
                    ],
                    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
                    safelist: ['html', 'body', /^dark:/],
                },
            } :
            {}),
    },
};

export default config;