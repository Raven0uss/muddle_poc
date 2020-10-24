import React from "react";
import { View, TouchableHighlight } from "react-native";
import { withTheme, Button, Card, Title, Paragraph } from "react-native-paper";
import Icon from "../Components/Icon";

import Header from "../Components/Header";

const TestComponent = (props) => {
  const { navigation } = props;
  const { colors } = props.theme;

  return (
    <View>
      <Header
        RightComponent={
          <TouchableHighlight
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icon name="gavel" size={24} color={colors.primary} />
          </TouchableHighlight>
        }
      />
    </View>
  );
};

export default withTheme(TestComponent);
