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
import CustomIcon from "../Components/Icon";
import i18n from "../i18n";
import { muddle } from "../CustomProperties/IconsBase64";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";
import PDFReader from "rn-pdf-reader-js";

import { privacy } from "../CustomProperties/LegalDocuments64";

const VotesPrivacy = (props) => {
  const { theme } = React.useContext(ThemeContext);
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
      <PDFReader
        source={{
          base64: "data:application/pdf;base64," + privacy[i18n.language],
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F47658",
  },
});

export default VotesPrivacy;
