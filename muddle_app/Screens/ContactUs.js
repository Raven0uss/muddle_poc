import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Text,
} from "react-native";
import Header from "../Components/Header";
import { withTheme } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import CustomIcon from "../Components/Icon";
import { muddle } from "../CustomProperties/IconsBase64";
import i18n from "../i18n";

const ContactUs = (props) => {
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
        <View style={{ justifyContent: "center", marginTop: 30 }}>
          <Text
            style={{ textAlign: "center", fontFamily: "Montserrat_500Medium" }}
          >
            {i18n._("forAllQuestionsContact")}
          </Text>
          <TouchableOpacity>
            <Text
              style={{
                textAlign: "center",
                marginTop: 20,
                fontSize: 16,
                fontFamily: "Montserrat_700Bold",
              }}
            >
              contact@muddles.fr
            </Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: "#F7F7F7",
    paddingLeft: 15,
    paddingRight: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});

export default withTheme(ContactUs);
