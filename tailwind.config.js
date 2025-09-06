/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#10b981',
        'primary-green-dark': '#059669',
        'primary-green-light': '#34d399',
        'light-green-bg': '#ecfdf5',
        'dark-text': '#111827',
        'medium-text': '#374151',
        'light-text': '#6b7280',
        'background': '#fafafa',
        'card-bg': '#ffffff',
        'border-color': '#e5e7eb',
        'border-color-light': '#f3f4f6',
        'hover-bg': '#f9fafb',
      },
    },
  },
  plugins: [],
}