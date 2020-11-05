import React from "react";
import { Image, StyleSheet } from "react-native";
import { languages } from "../CustomProperties/IconsBase64";
import i18n from "../i18n";

const LangSelect = (props) => {
  const locale = i18n.language;

  return (
    <Image
      style={styles.logo}
      source={{
        uri: languages[locale],
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  logo: {
    width: 42,
    height: 42,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 30,
  },
});

export default LangSelect;
