# Muddle - React Native Client (Expo)

<p>
  <!-- iOS -->
  <img alt="Supports Expo iOS" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff" />
  <!-- Android -->
  <img alt="Supports Expo Android" longdesc="Supports Expo Android" src="https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff" />
  <!-- Web -->
  <img alt="Supports Expo Web" longdesc="Supports Expo Web" src="https://img.shields.io/badge/web-4630EB.svg?style=flat-square&logo=GOOGLE-CHROME&labelColor=4285F4&logoColor=fff" />
</p>

## 🚀 How to use

- Install with `yarn` or `npm install`.
- Run `npm start` to try it out.

## Apollo

- The Apollo configuration lies in the `apollo.js` file.
- The file also contains an option (with commented code) to pass an authorization token to the API.
- [Apollo Client Docs](https://www.apollographql.com/docs/react/v3.0-beta/)

## i18n

- Run `npm run extract` to get all the strings.
- To compile it for the project execute `npm run compile`.
- That's it.

- All the translations are located in `locales/{TAG_LANG}/messages.po`. When you execute the compile command, it parse the files and generate a `messages.js` for each languages.

- Add a new language is simple, run `npm run add-locale <tag_lang_1> <tag_lang_2> ...`, execute the extract command to add the strings to the new languages. Modify the `messages.po` for the new languages and compile it with `npm run compile`. Finaly, import and add the `messages.js` to the catalog inside `i18n.js` and that's it.
