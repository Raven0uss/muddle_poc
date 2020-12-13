import { get } from "lodash";
import React from "react";
import { View, Text } from "react-native";

const Badge = (props) => {
  const nb = get(props, "nb", 0);

  if (nb === 0) return null;
  return (
    <View style={props.viewStyle}>
      <Text
        style={{
          color: "#fff",
          fontSize: 10,
          fontFamily: "Montserrat_700Bold",
          textAlign: "center",
        }}
      >
        {nb > 99 ? "+99" : `${nb}`}
      </Text>
    </View>
  );
};

export default Badge;
