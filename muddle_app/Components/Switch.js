import React from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import PropTypes from "prop-types";

const Switch = (props) => {
  return (
    <TouchableWithoutFeedback onPress={props.onValueChange}>
      <View
        style={{
          backgroundColor: props.outColor,
          height: 30,
          width: 30,
          borderRadius: 30,
          borderColor: "#F0F0F0",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {props.value && (
          <View
            style={{
              backgroundColor: props.inColor,
              height: 24,
              width: 24,
              borderRadius: 30,
            }}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

Switch.propTypes = {
  value: PropTypes.bool.isRequired,
  onValueChange: PropTypes.func.isRequired,
  inColor: PropTypes.string,
  outColor: PropTypes.string,
};

Switch.defaultProps = {
  inColor: "#000",
  outColor: "#FFF",
};

export default Switch;
