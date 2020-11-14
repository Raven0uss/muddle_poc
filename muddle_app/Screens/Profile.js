import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
} from "react-native";
import { withTheme } from "react-native-paper";
import Header from "../Components/Header";
import {
  defaultCover,
  debates_logo,
  coverTest,
  defaultProfile,
} from "../CustomProperties/IconsBase64";
import CustomIcon from "../Components/Icon";
import { ScrollView } from "react-native-gesture-handler";
import AssistiveMenu from "../Components/AssistiveMenu";
import CreateDebateButton from "../Components/CreateDebateButton";
import { muddle } from "../CustomProperties/IconsBase64";

const Profile = (props) => {
  const { navigation, route } = props;
  return (
    <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
      <Image
        source={{
          uri: coverTest,
        }}
        style={{
          height: 240,
          width: Dimensions.get("screen").width,
          position: "absolute",
        }}
        resizeMode="cover"
      />
      <Header
        LeftComponent={
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              marginTop: 3,
              borderRadius: 50,
              backgroundColor: "rgba(255, 255, 255, 0.6)",
            }}
          >
            <CustomIcon name={"chevron-left"} size={38} />
          </TouchableOpacity>
        }
        RightComponent={
          <TouchableOpacity
            onPress={() => navigation.push("DebatesFiltered")}
            style={{
              //   marginTop: 3,
              borderRadius: 50,
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              marginTop: 6,
              width: 38,
              height: 38,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: debates_logo }}
              style={{
                width: 32,
                height: 32,
              }}
            />
          </TouchableOpacity>
        }
      />

      {/* Cadre Profil */}
      <View
        style={{
          width: Dimensions.get("screen").width / 1.2,
          height: 100,
          borderRadius: 30,
          backgroundColor: "#fff",
          marginTop: 110,
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: 30,
        }}
      >
        <TouchableOpacity
          style={{
            position: "absolute",
            width: 50,
            height: 52,
            backgroundColor: "#fff",
            borderRadius: 20,
            borderColor: "#F47658",
            borderStyle: "solid",
            borderWidth: 2,
            // marginLeft: "auto",
            right: 0,
            bottom: 0,
            marginRight: -10,
            // marginTop: "auto",
            marginBottom: -10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Nombre des trophees */}
          <Text
            style={{
              fontSize: 10,
              marginTop: -3,
              marginBottom: 3,
              fontWeight: "bold",
            }}
          >
            126
          </Text>
          <Image
            source={{
              uri: muddle.trophies_light, // Have to be dynamic par rapport au theme
            }}
            style={{
              width: 30,
              height: 22,
            }}
          />
        </TouchableOpacity>
        <Image
          source={{
            uri: defaultProfile,
          }}
          style={{
            width: 90,
            height: 90,
            borderRadius: 30,
            borderWidth: 1,
            marginTop: "auto",
            marginBottom: "auto",
            padding: 5,
            marginLeft: 5,
          }}
          resizeMode="center"
        />
      </View>

      {/* Historique des interactions */}
      <ScrollView>
        <View
          style={{
            width: Dimensions.get("screen").width / 1.2,
            height: 100,
            borderRadius: 5,
            backgroundColor: "#fff",
          }}
        ></View>
      </ScrollView>
      <AssistiveMenu navigation={navigation} route={route} />
      <CreateDebateButton navigation={navigation} />
    </View>
  );
};

export default withTheme(Profile);
