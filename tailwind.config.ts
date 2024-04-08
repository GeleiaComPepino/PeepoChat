/** @type {import('tailwindcss').Config} */

export default {
	content: ["./src/**/*.{vue,ts}"],

	darkMode: "class",

	theme: {
		screens: {
			xs: "0px",
			md: "968px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",
		},

		extend: {
			colors: {
				// brands
				"twitch-background": "#9146FF",
				"twitch-icon": "#ffffff",
				"youtube-background": "#FF0000",
				"youtube-icon": "#ffffff",
				"kick-background": "#53FC18",
				"kick-icon": "#000000",

				// primary
				'shark': {
					'50': '#f6f6f6',
					'100': '#e7e7e7',
					'200': '#d1d1d1',
					'300': '#b0b0b0',
					'400': '#888888',
					'500': '#6d6d6d',
					'600': '#5d5d5d',
					'700': '#4f4f4f',
					'800': '#454545',
					'900': '#252526',
					'950': '#1e1e1e',
				},

				// accent
				"spring-green": {
					50: "#eefff5",
					100: "#d7ffea",
					200: "#b2ffd7",
					300: "#52ffa8",
					400: "#33f594",
					500: "#09de74",
					600: "#01b85d",
					700: "#05904c",
					800: "#0a713f",
					900: "#0a5d36",
					950: "#00341c",
				},
			},

			spacing: {
				0: "0",
				1: "2px",
				2: "4px",
				3: "8px",
				4: "12px",
				5: "16px",
				6: "24px",
				7: "32px",
				8: "40px",
				9: "48px",
				10: "64px",
				11: "80px",
				12: "96px",
				13: "160px",
			},

			borderRadius: {
				none: "0",
				sm: "8px",
				DEFAULT: "12px",
				lg: "20px",
				full: "9999px",
			},

			opacity: {
				0: "0",
				20: "0.20",
				30: "0.30",
				40: "0.40",
				50: "0.54",
				60: "0.63",
				70: "0.70",
				80: "0.80",
				90: "0.90",
				100: "1",
			},

			boxShadow: {
				cxl: "0 2px 5px rgba(193, 202, 255, 0.5), 2px 0 5px rgba(193, 202, 255, 0.5), -2px 0 5px rgba(193, 202, 255, 0.5), 0 -2px 5px rgba(193, 202, 255, 0.5)",
				"shadow-sm": "0px 1px 3px 0px rgba(5,5,5,0.10)",
				shadow: "rgb(145 158 171 / 20%) 0px 1px 3px 0px , rgb(145 158 171 / 12%) 0px 1px 2px -4px",
				"shadow-md":
					"0px 3px 4px 0px rgba(3,3,3,0.1), 0px 2px 4px 0px rgba(3,3,3,0.1)",
				"shadow-lg":
					"0px 10px 20px 0px rgba(3,3,3,0.1), 0px 3px 6px 0px rgba(3,3,3,0.1)",
				"shadow-xl":
					"0px 15px 25px 0px rgba(3,3,3,0.1), 0px 5px 10px 0px rgba(3,3,3,0.1)",
			},

			keyframes: {
				gradient: {
					"0%": {
						"background-position": "0% 0%",
					},

					"50%": {
						"background-position": "0% 100%",
					},

					"100%": {
						"background-position": "0% 0%",
					},
				},
			},

			animation: {
				gradient: "gradient 15s ease infinite"
			},
		},
	},

	plugins: [],
};
