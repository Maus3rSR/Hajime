module.exports = {
    mode: 'jit',
    purge: ['./src/**/*.{html,vue,js,jsx,ts,tsx}'],
    darkMode: false, // or 'media' or 'class'
    plugins: [require('daisyui')],
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    daisyui: {
        themes: [
            {
                'hajime': {
                    'primary': '#a83844',
                    'primary-focus': '#af4c5e',
                    'primary-content': '#f7f7f7',
                    'secondary': '#200c25',
                    'secondary-focus': '#32133a',
                    'secondary-content': '#af4c5e',
                    'accent': '#31d47d',
                    'accent-focus': '#27ba6d',
                    'accent-content': '#ffffff',
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
