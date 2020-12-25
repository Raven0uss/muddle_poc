import React from "react";
import { View, Image } from "react-native";
import { badges } from "../CustomProperties/IconsBase64";

const CertifiedIcon = () => {
  return (
    <View
      style={{
        paddingLeft: 4,
        paddingTop: 2,
      }}
    >
      <Image
        source={{ uri: badges.verified }}
        style={{
          width: 10,
          height: 10,
        }}
      />
    </View>
  );
};

export default CertifiedIcon;
