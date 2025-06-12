module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            fontFamily: {
                luckiest: ['"Luckiest Guy"', 'cursive'],
            },
            backgroundImage: {
                'dice-gradient': 'linear-gradient(90deg, #f67280, #f8b195, #f6d365, #c06c84, #6c5b7b)',
            },
            boxShadow: {
                'text-subtle': '1px 1px 2px rgba(0,0,0,0.1)',
            },
        },
    },
    plugins: [],
};
