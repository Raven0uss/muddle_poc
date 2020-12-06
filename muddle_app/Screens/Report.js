import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import Header from "../Components/Header";
import { withTheme } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import CustomIcon from "../Components/Icon";
import { muddle, defaultProfile } from "../CustomProperties/IconsBase64";
import Select from "../Components/Select";

const Report = (props) => {
  const [form, setForm] = React.useState({
    reason: null,
    reasonText: "",
  });
  const { navigation, route } = props;
  const { type, content } = route.params;

  return (
    <View style={styles.container}>
      <Header
        LeftComponent={
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginTop: 3 }}
          >
            <CustomIcon name={"chevron-left"} size={38} />
          </TouchableOpacity>
        }
        MiddleComponent={
          <Image
            source={{ uri: muddle.nb }}
            style={{
              width: 50,
              height: 28,
              marginTop: 8,
              marginLeft: -32,
              marginBottom: 10,
            }}
          />
        }
      />
      <View
        style={{
          flex: 1,
          backgroundColor: "#F7F7F7",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          paddingLeft: 15,
          paddingRight: 15,
          //   alignItems: "center"
        }}
      >
        <Text
          style={{
            marginTop: 30,
            marginBottom: 30,
            alignSelf: "center",
            fontFamily: "Montserrat_700Bold",
          }}
        >
          Signaler un {`${type === "DEBATE" ? "debat" : "commentaire"}`}
        </Text>
        <Select
          list={[
            {
              label: "Propos injurieux",
              value: "INSULT",
            },
            {
              label: "Propos racistes",
              value: "RACISM",
            },
            {
              label: "Propos sexistes",
              value: "SEXISM",
            },
            {
              label: "Contenu violent",
              value: "VIOLENCE",
            },
            {
              label: "Contenu pornographique",
              value: "PORNOGRAPHY",
            },
          ]}
          selected={form.reason}
          placeholder="Selectionner le motif"
          onSelect={(reason) =>
            setForm({
              ...form,
              reason,
            })
          }
        />
        <KeyboardAvoidingView behavior="padding">
          <TextInput
            placeholder="Donnez plus de details afin de traiter votre demande..."
            value={form.reasonText}
            onChangeText={(reasonText) =>
              setForm({
                ...form,
                reasonText,
              })
            }
            style={styles.input}
            keyboardType="default"
            placeholderTextColor="#222"
            multiline
            textAlignVertical="top"
          />
        </KeyboardAvoidingView>
        <TouchableOpacity
          onPress={() => {}}
          style={{
            alignSelf: "flex-end",
            backgroundColor: "#F47658",
            padding: 12,
            paddingLeft: 30,
            paddingRight: 30,
            borderRadius: 30,
            marginTop: 20,
          }}
        >
          <Text
            style={{
              color: "#000",
              fontFamily: "Montserrat_700Bold",
            }}
          >
            Signaler
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F47658",
  },
  userPicture: {
    width: 40,
    height: 40,
    borderRadius: 30,
  },
  input: {
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    width: "100%",
    borderRadius: 10,
    color: "#000",
    // marginBottom: 18,
    height: 120,
    // maxHeight: 1200,
    overflow: "scroll",
    fontFamily: "Montserrat_500Medium",
  },
});

export default withTheme(Report);
