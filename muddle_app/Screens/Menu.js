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

const Menu = (props) => {
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
          onPress={() => navigation.push("Settings")}
        >
          <CustomIcon name="settings" size={28} color="#A3A3A3" />
          <Text style={styles.menuText}>Parametres</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuElement}
          onPress={() => navigation.push("LegaleMentions")}
        >
          <CustomIcon name="lock" size={28} color="#A3A3A3" />
          <Text style={styles.menuText}>
            Mentions legales & Confidentialite
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuElement}
          onPress={() => navigation.push("Cgu")}
        >
          <CustomIcon name="description" size={28} color="#A3A3A3" />
          <Text style={styles.menuText}>
            Conditions generales d'utilisation
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuElement}
          onPress={() => navigation.push("ContactUs")}
        >
          <CustomIcon name="chat" size={28} color="#A3A3A3" />
          <Text style={styles.menuText}>Nous contacter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuElement}
          onPress={() => {
            console.log("Log out");
            // navigation.push("Settings");
          }}
        >
          <CustomIcon name="exit-to-app" size={28} color="#A3A3A3" />
          <Text style={styles.menuText}>Se deconnecter</Text>
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

export default withTheme(Menu);
