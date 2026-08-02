module.exports = {
  locales: ['en', 'hi', 'ta'],
  defaultNamespace: 'common',
  output: 'src/locales/$LOCALE/$NAMESPACE.json',
  createOldCatalogs: false,
  keySeparator: '.',           // keep dot notation for sections
  namespaceSeparator: ':',
  lexers: {
    js:  ['JsxLexer'],         // parse .js/.jsx
    jsx: ['JsxLexer'],
    ts:  ['JsxLexer'],
    tsx: ['JsxLexer']
  },
  func: {
    list: ['t', 'i18n.t'],     // scan t('key') calls
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  trans: {
    component: 'Trans',        // scan <Trans>...</Trans>
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
};