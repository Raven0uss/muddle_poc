import React from "react";
import { View, TouchableHighlight } from "react-native";
import { withTheme, Button, Card, Title, Paragraph } from "react-native-paper";
import Icon from "../Components/Icon";

import Header from "../Components/Header";
import Switch from "../Components/Switch";
import DatePicker from "../Components/DatePicker";
import LangSelect from "../Components/LangMiniature";

const TestComponent = (props) => {
  const [sw, setSw] = React.useState(true);
  const [date, setDate] = React.useState(new Date());

  const { navigation } = props;
  const { colors } = props.theme;

  return (
    <View>
      <Header hidden />
      {/* <Switch value={sw} onValueChange={() => setSw((s) => !s)} /> */}
      {/* <DatePicker date={date} onDateChange={setDate} />
       */}
      <LangSelect />
    </View>
  );
};

export default withTheme(TestComponent);
