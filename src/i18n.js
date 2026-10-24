import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from '../locales/en/translation.json';
import { DEFAULT_LANGUAGE } from './utils/languages';
// If you add more languages, import them too:
// import hiCommon from '../locales/hi/common.json';
// import frCommon from '../locales/fr/common.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
      },
      // hi: { common: hiCommon },
      // fr: { common: frCommon },
    },
    lng: DEFAULT_LANGUAGE,   // Keep runtime and available profile choices aligned.
    fallbackLng: 'en',
    ns: ['common'],          // 👈 only use the common namespace
    defaultNS: 'common',     // 👈 set common as default
    interpolation: {
      escapeValue: false,    // react already escapes
    },
  });

export default i18n;