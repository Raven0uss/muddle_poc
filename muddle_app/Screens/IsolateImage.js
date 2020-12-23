import React from "react";
import { View, Image, Dimensions, TouchableOpacity } from "react-native";
import CustomIcon from "../Components/Icon";

const IsolateImage = (props) => {
  const { navigation, route } = props;

  const { image } = route.params;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000000",
      }}
    >
      <View
        style={{
          position: "absolute",
          marginTop: 40,
          marginRight: 10,
          right: 0,
          backgroundColor: "#000000",
          zIndex: 100,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <CustomIcon name="close" size={38} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Image
        source={{ uri: image }}
        style={{
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height,
        }}
        resizeMode={"contain"}
        // resizeMethod=""
      />
    </View>
  );
};

export default IsolateImage;
