import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";

const CustomIcon = (props) => {
  return (
    <View>
      <Icon
        name={props.name}
        size={props.size}
        style={{
          backgroundColor: `${props.bcolor}`,
          color: `${props.color}`,
          paddingLeft: props.pLeft,
          borderRadius: props.radius,
          padding: props.padding,
        }}
      />
    </View>
  );
};

CustomIcon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  bcolor: PropTypes.string,
  color: PropTypes.string,
  pLeft: PropTypes.number,
  padding: PropTypes.number,
  radius: PropTypes.number,
};

CustomIcon.defaultProps = {
  size: 24,
  bcolor: "unset",
  color: "#000",
  pLeft: 0,
  padding: 0,
  radius: 0,
};

export default CustomIcon;
