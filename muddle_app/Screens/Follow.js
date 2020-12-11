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
import { ScrollView } from "react-native-gesture-handler";
import CustomIcon from "../Components/Icon";
import { muddle, defaultProfile } from "../CustomProperties/IconsBase64";
import i18n from "../i18n";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";

const Follow = (props) => {
  const { theme } = React.useContext(ThemeContext);
  const [vision, setVision] = React.useState(props.route.params.selected);

  const { navigation, route } = props;
  const { follow } = route.params;
  console.log(vision);
  console.log(props.route.params);
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
      <View
        style={{
          backgroundColor: themeSchema[theme].backgroundColor2,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          paddingLeft: 15,
          paddingRight: 15,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: Dimensions.get("screen").width / 1.2,
            backgroundColor: themeSchema[theme].backgroundColor1,
            height: 44,
            borderRadius: 40,
            marginTop: 33,
            marginBottom: 33,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              width: "50%",
              backgroundColor:
                vision === "followers"
                  ? "#F47658"
                  : themeSchema[theme].backgroundColor1,
              borderRadius: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              setVision("followers");
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat_700Bold",
                fontSize: 14,
                color: themeSchema[theme].colorText,
              }}
            >
              {i18n._("followers")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "50%",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                vision === "following"
                  ? "#F47658"
                  : themeSchema[theme].backgroundColor1,
              borderRadius: 40,
            }}
            onPress={() => {
              setVision("following");
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat_700Bold",
                fontSize: 14,
                color: themeSchema[theme].colorText,
              }}
            >
              {i18n._("following")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        style={{
          ...styles.seedContainer,
          backgroundColor: themeSchema[theme].backgroundColor2,
        }}
      >
        {follow[vision].map((contact) => (
          <TouchableOpacity
            key={contact.id}
            onPress={() => {
              navigation.push("Profile", {
                userId: contact.pseudo,
              });
            }}
          >
            <View
              style={{
                backgroundColor: themeSchema[theme].backgroundColor1,
                borderRadius: 12,
                marginTop: 5,
                marginBottom: 5,
                padding: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: contact.profilePicture }}
                style={styles.userPicture}
              />
              <Text
                style={{
                  fontFamily: "Montserrat_500Medium",
                  marginLeft: 10,
                  fontSize: 14,
                  color: themeSchema[theme].colorText,
                }}
              >
                {contact.pseudo}
              </Text>
            </View>
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
    backgroundColor: "#FFFFFF",
    paddingLeft: 15,
    paddingRight: 15,
  },
  userPicture: {
    width: 40,
    height: 40,
    borderRadius: 30,
  },
});

export default Follow;
