import i18n from "i18next";
import { initReactI18next } from "react-i18next";


// Importing translation files

import translationEN from "./locale/en/translation.json";
import translationNN from "./locale/nn/translation.json";


//Creating object with the variables of imported translation files
const resources = {
  en: {
    translation: translationEN,
  },
  nn: {
    translation: translationNN,
  },
};

//i18N Initialization

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng:document.documentElement.lang, //default language  --> document.documentElement.lang
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
export const t = i18n.t.bind(i18n);