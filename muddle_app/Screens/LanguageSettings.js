import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
} from "react-native";
import Header from "../Components/Header";
import { withTheme } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import CustomIcon from "../Components/Icon";
import { muddle } from "../CustomProperties/IconsBase64";
import i18n from "../i18n";
import { lang } from "moment";

const languages = {
  fr: "Francais",
  en: "English",
};

const LanguageSettings = (props) => {
  const [locale, setLocale] = React.useState(i18n.language);

  const { navigation, route } = props;
  return (
    <View style={styles.container}>
      <Header
        LeftComponent={
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginTop: 3 }}
          >
            <CustomIcon name={"chevron-left"} size={38} />
          </TouchableOpacity>
        }
        MiddleComponent={
          <Image
            source={{ uri: muddle.nb }}
            style={{
              width: 50,
              height: 28,
              marginTop: 8,
              marginLeft: -32,
              marginBottom: 10,
            }}
          />
        }
      />
      <ScrollView style={styles.seedContainer}>
        {Object.keys(languages).map((key) => (
          <TouchableOpacity
            style={
              key === locale ? styles.menuElementSelected : styles.menuElement
            }
            onPress={() => {
              route.params.changeLanguage(key);
              setLocale(key);
              i18n.activate(key);
            }}
          >
            <Text style={styles.menuText}>{languages[key]}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F47658",
  },
  seedContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "#FFF",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 20,
  },
  menuElement: {
    backgroundColor: "#F7F7F7",
    width: Dimensions.get("screen").width / 1.1,
    marginTop: 8,
    borderRadius: 12,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  menuElementSelected: {
    backgroundColor: "#F7F7F7",
    width: Dimensions.get("screen").width / 1.1,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#F47658",
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
});

export default withTheme(LanguageSettings);
