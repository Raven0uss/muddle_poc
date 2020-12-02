import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
} from "react-native";
import Header from "../Components/Header";
import { withTheme } from "react-native-paper";
import CustomIcon from "../Components/Icon";
import { muddle } from "../CustomProperties/IconsBase64";


// const GET_TROPHIES = gql`
//   query($first: Int!, $skip: Int) {
//     trophies(first: $first, skip: $skip) {
//       id
//       user {
//         id
//         pseudo
//       }
//       won
//       type
//       debate {
//         id
//         comments {
//             id
//         }
        
//       }
//       comment {
//         id
//         debate {

//         }
//       }
//     }
//   }
// `;

const Trophies = (props) => {
  const [search, setSearch] = React.useState("");

  const { navigation, route } = props;
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
            source={{ uri: muddle.trophies_light }}
            style={{
              width: 40,
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
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          backgroundColor: "#FFF",
        }}
      >
        <TextInput
          placeholder="Rechercher"
          value={search}
          style={{
            width: Dimensions.get("screen").width / 1.15,
            height: 40,
            borderRadius: 10,
            backgroundColor: "#f7f7f7",
            marginLeft: "auto",
            marginRight: "auto",
            padding: 10,
            paddingLeft: 20,
            paddingRight: 20,
            marginBottom: 14,
            marginTop: 33,
            marginBottom: 35,
          }}
          keyboardType="default"
          onChangeText={(s) => setSearch(s)}
        />
      </View>
      <ScrollView style={styles.seedContainer}></ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F47658",
  },
  seedContainer: {
    backgroundColor: "#FFF",
    paddingLeft: 15,
    paddingRight: 15,
  },
});

export default withTheme(Trophies);
