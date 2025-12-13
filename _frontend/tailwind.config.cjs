/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./index.html',
		'./src/**/*.{js,jsx,ts,tsx}'
	],
	theme: {
		extend: {
			colors: {
				primary: '#065f46',
				'muted-foreground': '#6b7280'
			},
			borderRadius: {
				xl: '12px',
				'2xl': '18px'
			}
		}
	},
	plugins: [],
}
