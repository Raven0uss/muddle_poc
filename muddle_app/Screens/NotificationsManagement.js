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
import { muddle } from "../CustomProperties/IconsBase64";
import { useIsFocused } from "@react-navigation/native";
import i18n from "../i18n";
import ThemeContext from "../CustomProperties/ThemeContext";
import UserContext from "../CustomProperties/UserContext";
import themeSchema from "../CustomProperties/Theme";
import { removeItem } from "../CustomProperties/storage";

const NotificationsManagement = (props) => {
  const { theme } = React.useContext(ThemeContext);
  const { setCurrentUser } = React.useContext(UserContext);
  const [refresh, setRefresh] = React.useState(true);

  const isFocused = useIsFocused();
  React.useEffect(() => {
    setRefresh(true);
  }, [isFocused]);

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
      <ScrollView
        style={{
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          backgroundColor: themeSchema[theme].backgroundColor2,
          paddingLeft: 15,
          paddingRight: 15,
          paddingTop: 20,
        }}
      >
       
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
  // menuElement: {
  //   backgroundColor: themeSchema[theme].backgroundColor1,
  //   width: Dimensions.get("screen").width / 1.1,
  //   marginTop: 8,
  //   borderRadius: 12,
  //   padding: 8,
  //   flexDirection: "row",
  //   alignItems: "center",
  // },
  menuText: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
});

export default NotificationsManagement;
