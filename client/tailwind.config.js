// Original config
// module.exports = {
//   future: {
//     // removeDeprecatedGapUtilities: true,
//     // purgeLayersByDefault: true,
//   },
//   purge: [],
//   theme: {
//     extend: {},
//   },
//   variants: {},
//   plugins: [],
// }

module.exports = {
  darkMode: 'class',
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  content: [
    'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite/**/*.{js,jsx,ts,tsx}'
  ],
  purge: [],
  theme: {
    extend: {
      transitionProperty: {
      'height': 'height'
    }},
  },
  variants: {
    width: ["responsive", "hover", "focus"]
  },
  plugins: [
    require('flowbite/plugin')
],
}


// offered as flowbite-vue
// module.exports = {
//   content: [
//     'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}',
//     'node_modules/flowbite/**/*.{js,jsx,ts,tsx}'
//   ],
//   plugins: [
//       require('flowbite/plugin')
//   ],
//   theme: {}
// }