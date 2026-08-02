module.exports = {
  input: ['src//*.{js,jsx,ts,tsx}'],
  output: './locales',
  options: {
    debug: true,
    removeUnusedKeys: true,
    sort: true,
    func: {
      list: ['t'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    trans: {
      component: 'Trans',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    lngs: ['en'],              // add more like ['en','hi','fr']
    ns: ['common'],            // 👈 use common namespace
    defaultLng: 'en',
    defaultNs: 'common',       // 👈 make common the default namespace
    resource: {
      loadPath: 'locales/{{lng}}/{{ns}}.json',
      savePath: 'locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2,
    },
    interpolation: {
      prefix: '{{',
      suffix: '}}',
    },
  },
};