import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, SafeAreaView, Platform } from "react-native";
import getStatusBarHeight from "../Library/getStatusBarHeight";

const safeStatusHeight = {
  marginTop: Platform.OS === "android" ? 10 : getStatusBarHeight() + 10,
};

// Issue of gap if there is only 2 headerComponent, including middle and
// one of the left or the right.

const Header = (props) => {
  const { LeftComponent, MiddleComponent, RightComponent } = props;

  if (props.hidden) return <SafeAreaView style={safeStatusHeight} />;

  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.headerLeftComponent}>{props.LeftComponent}</View>
      <View>{props.MiddleComponent}</View>
      <View style={styles.headerRightComponent}>{props.RightComponent}</View>
    </SafeAreaView>
  );
};

// Use to define the space between sides of the screens and icons on left and right.
const blankspaceCorner = 20;
const styles = StyleSheet.create({
  headerContainer: {
    ...safeStatusHeight,
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingTop: 20,
    marginBottom: 5,
  },
  headerLeftComponent: {
    marginLeft: blankspaceCorner,
  },
  headerRightComponent: {
    marginRight: blankspaceCorner,
  },
});

Header.propTypes = {
  hidden: PropTypes.bool,
  LeftComponent: PropTypes.any,
  MiddleComponent: PropTypes.any,
  RightComponent: PropTypes.any,
};

Header.defaultProps = {
  hidden: false,
  LeftComponent: () => null,
  MiddleComponent: () => null,
  RightComponent: () => null,
};

export default Header;
