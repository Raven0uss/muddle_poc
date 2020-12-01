import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
  ScrollView,
} from "react-native";
import Header from "../Components/Header";
import { withTheme } from "react-native-paper";
import CustomIcon from "../Components/Icon";
import { muddle } from "../CustomProperties/IconsBase64";

const Settings = (props) => {
  const [theme, setTheme] = React.useState("light");
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
        <TouchableOpacity
          style={styles.menuElement}
          onPress={() => navigation.push("LanguageSettings")}
        >
          <CustomIcon name="language" size={28} color="#F47658" />
          <Text style={styles.menuText}>Changer la langue</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuElement}
          onPress={() =>
            setTheme((currentTheme) =>
              currentTheme === "light" ? "dark" : "light"
            )
          }
        >
          <CustomIcon name="flare" size={28} color="#F47658" />
          <Text style={styles.menuText}>
            {theme === "light"
              ? "Passer en mode sombre"
              : "Passer en mode clair"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuElement}
          onPress={() => navigation.push("VotesPrivacy")}
        >
          <CustomIcon name="vpn-key" size={28} color="#F47658" />
          <Text style={styles.menuText}>Confidentialite des votes</Text>
        </TouchableOpacity>
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
  menuText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "400",
  },
});

export default withTheme(Settings);
