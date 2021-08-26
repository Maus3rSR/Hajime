module.exports = {
    mode: 'jit',
    purge: ['./src/**/*.{html,vue,js,jsx,ts,tsx}'],
    darkMode: false, // or 'media' or 'class'
    plugins: [require('daisyui')],
    theme: {
        extend: { },
    },
    variants: {
        extend: { },
    },
    daisyui: {
        themes: [
            {
                'hajime': {
                    'primary': '#a83844',
                    'primary-focus': '#af4c5e',
                    'primary-content': '#f7f7f7',
                    'secondary': '#25263a',
                    'secondary-focus': '#363856',
                    'secondary-content': '#f7f7f7',
                    'accent': '#200c25',
                    'accent-focus': '#af4c5e',
                    'accent-content': '#af4c5e',
                    'neutral': '#25263a',
                    'neutral-focus': '#363856',
                    'neutral-content': '#f7f7f7',
                    'base-100': '#15161b',
                    'base-200': '#25263a',
                    'base-300': '#af4c5e',
                    'base-content': '#f7f7f7',
                    'info': '#06bee1',
                    'success': '#20ba37',
                    'warning': '#ff9900',
                    'error': '#fa1d22',
                },
            },
        ],
    },
}
