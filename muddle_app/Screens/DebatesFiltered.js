import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
} from "react-native";
import Header from "../Components/Header";
import { withTheme } from "react-native-paper";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import CustomIcon from "../Components/Icon";
import { muddle } from "../CustomProperties/IconsBase64";

const DebatesFiltered = (props) => {
  const [debateType, setDebateType] = React.useState("DUO_DEBATES");
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
      <View
        style={{
          backgroundColor: "#F7F7F7",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          paddingTop: 33,
          flexDirection: "row",
        }}
      >
        <ScrollView
          horizontal
          style={{ height: 60 }}
          persistentScrollbar={false}
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity
            style={
              debateType === "BEST_DEBATES"
                ? styles.buttonActivate
                : styles.buttonDefaultState
            }
            onPress={() => setDebateType("BEST_DEBATES")}
          >
            <Text style={styles.buttonTextDefaultState}>
              Les meilleurs debats
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              debateType === "DUO_DEBATES"
                ? styles.buttonActivate
                : styles.buttonDefaultState
            }
            onPress={() => setDebateType("DUO_DEBATES")}
          >
            <Text style={styles.buttonTextDefaultState}>Les debats en duo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              debateType === "GENERATED_DEBATES"
                ? styles.buttonActivate
                : styles.buttonDefaultState
            }
            onPress={() => setDebateType("GENERATED_DEBATES")}
          >
            <Text style={styles.buttonTextDefaultState}>
              Les debats generes
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.seedContainer}>
        <View
          style={{
            width: Dimensions.get("screen").width / 1.15,
            height: 100,
            borderRadius: 10,
            backgroundColor: "#fff",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        ></View>
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
    // borderTopLeftRadius: 15,
    // borderTopRightRadius: 15,
    backgroundColor: "#F7F7F7",
    paddingLeft: 15,
    paddingRight: 15,
  },
  buttonDefaultState: {
    borderStyle: "solid",
    borderWidth: 2,
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    borderRadius: 40,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  buttonActivate: {
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#F47658",
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    borderRadius: 40,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "#F47658",
  },
  buttonTextDefaultState: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default withTheme(DebatesFiltered);
