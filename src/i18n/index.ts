import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';
import bn from './locales/bn.json';
import te from './locales/te.json';
import ta from './locales/ta.json';
import mr from './locales/mr.json';
import gu from './locales/gu.json';
import ur from './locales/ur.json';
import pa from './locales/pa.json';
import kn from './locales/kn.json';
import ml from './locales/ml.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  bn: { translation: bn },
  te: { translation: te },
  ta: { translation: ta },
  mr: { translation: mr },
  gu: { translation: gu },
  ur: { translation: ur },
  pa: { translation: pa },
  kn: { translation: kn },
  ml: { translation: ml },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;