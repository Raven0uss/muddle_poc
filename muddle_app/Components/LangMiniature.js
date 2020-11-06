import React from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import { languages } from "../CustomProperties/IconsBase64";
import i18n from "../i18n";

const LangSelect = (props) => {
  const [locale, setLocale] = React.useState(i18n.language);

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          const newLocale = locale === "en" ? "fr" : "en";

          props.changeLanguage(newLocale);
          setLocale(newLocale);
        }}
      >
        <View>
          <Image
            style={styles.logo}
            source={{
              uri: languages[locale],
            }}
          />
        </View>
      </TouchableOpacity>
    </View>
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
    elevation: 10,
  },
});

export default LangSelect;
