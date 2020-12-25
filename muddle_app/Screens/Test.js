import React from "react";
import {
  View,
  TouchableHighlight,
  Button,
  Image,
  ActivityIndicator,
} from "react-native";
// import { withTheme, Button, Card, Title, Paragraph } from "react-native-paper";
import Icon from "../Components/Icon";

import Header from "../Components/Header";
// import Switch from "../Components/Switch";
// import DatePicker from "../Components/DatePicker";
// import LangSelect from "../Components/LangMiniature";
import ImagePickerExample from "../Components/ImagePicker";
import { pickImageAndGetUrl } from "../Library/pickImage";
import { gql, useMutation } from "@apollo/client";
// import FormData from "form-data";

import { get } from "lodash";

const IMAGE = gql`
  mutation($localUri: String!) {
    imageUpload(localUri: $localUri) {
      image
    }
  }
`;

const TestComponent = (props) => {
  const [imageData, setImageData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  // const [sw, setSw] = React.useState(true);
  // const [date, setDate] = React.useState(new Date());

  const { navigation } = props;
  // const { colors } = props.theme;

  const [getImage] = useMutation(IMAGE);

  return (
    <View
      style={{
        flex: 1,
        // backgroundColor: "blue",
      }}
    >
      <Header hidden />
      {/* <Switch value={sw} onValueChange={() => setSw((s) => !s)} /> */}
      {/* <DatePicker date={date} onDateChange={setDate} />
       */}
      {/* <LangSelect /> */}
      {/* <ImagePickerExample />
       */}
      <Button
        title="wesh"
        onPress={async () => {
          setLoading(true);
          const result = await pickImageAndGetUrl();
          if (result !== null) setImageData(result);
          if (result === null) console.log("error");
          setLoading(false);
        }}
      />
      {loading && <ActivityIndicator size={64} />}
      {imageData !== null && (
        <Image
          source={{ uri: imageData }}
          style={{
            height: 200,
            width: 200,
          }}
        />
      )}
    </View>
  );
};

export default TestComponent;
