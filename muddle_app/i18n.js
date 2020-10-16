import { NativeModules, Platform } from "react-native";
import { setupI18n } from "@lingui/core";

import enMessages from "./locales/en/messages.js";
import frMessages from "./locales/fr/messages.js";

const catalogs = {
  en: enMessages,
  fr: frMessages,
};

export const getDeviceLocale = () => {
  const defaultLanguage = "fr";

  let locale = "";
  try {
    switch (Platform.OS) {
      case "ios": {
        const deviceLocale = NativeModules.SettingsManager.settings.AppleLocale;
        locale = deviceLocale.slice(0, 2);
        break;
      }
      case "android": {
        const deviceLocale = NativeModules.I18nManager.localeIdentifier;
        locale = deviceLocale.slice(0, 2);
        break;
      }
      default:
        return defaultLanguage;
    }
    if (locale.indexOf(Object.keys(catalogs)) === -1) return defaultLanguage;
    return locale;
  } catch (err) {
    console.error(
      err,
      "Didn't find the language of the device, return the default language."
    );
    return defaultLanguage;
  }
};

export default setupI18n({
  language: getDeviceLocale(),
  catalogs,
});
