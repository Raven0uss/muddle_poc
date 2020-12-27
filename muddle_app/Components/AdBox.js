import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
} from "react-native";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";
import i18n from "../i18n";

const AdBox = (props) => {
  const { theme } = React.useContext(ThemeContext);

  const { navigation, ad } = props;
  return (
    <TouchableOpacity
      onPress={() => {
        if (ad.link) {
          Linking.canOpenURL(ad.link).then((supported) => {
            console.log(supported);
            if (supported) Linking.openURL(ad.link);
          });
        }
      }}
    >
      <View
        style={{
          backgroundColor: themeSchema[theme].backgroundColor2,
          padding: 10,
          marginBottom: 8,
          borderRadius: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 3,
          }}
        >
          <Image
            source={{ uri: ad.companyIcon }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 50,
            }}
          />
          <Text
            style={{
              color: themeSchema[theme].colorText,
              marginLeft: 10,
              fontFamily: "Montserrat_500Medium",
            }}
          >
            {ad.company}
          </Text>
          <Text
            style={{
              color: themeSchema[theme].colorText,
              marginLeft: 10,
              fontFamily: "Montserrat_400Regular_Italic",
              fontSize: 10,
              marginTop: 2,
            }}
          >
            {i18n._("sponsorised")}
          </Text>
        </View>
        <View>
          <Image
            source={{ uri: ad.image }}
            style={{
              width: Dimensions.get("screen").width / 1.2,
              height: Dimensions.get("screen").height / 3,
              alignSelf: "center",
              borderRadius: 6,
              marginTop: 5,
              marginBottom: 5,
            }}
            resizeMode="cover"
          />
          <Text
            style={{
              color: themeSchema[theme].colorText,
              marginLeft: 7,
              fontFamily: "Montserrat_500Medium",
              fontSize: 12,
              marginTop: 3,
            }}
          >
            {ad.content}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AdBox;
