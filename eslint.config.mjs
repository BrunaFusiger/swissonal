import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
  formatters: {
    css: true,
    scss: true,
    html: true,
    markdown: 'prettier',
  },
})