import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import axios from "axios";
import { GRAPHQL_API_URL } from "../apollo";
import { get } from "lodash";

const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  const localUri = result.uri;
  return result.uri;
};

const pickImageAndGetUrl = async () => {
  try {
    const image = await pickImage();
    // console.log(image);
    var data = new FormData();
    data.append("test", {
      uri: image,
      name: "test.jpg",
      type: "image/jpg",
    });
    const result = await axios({
      method: "post",
      url: `http://${GRAPHQL_API_URL}/getImage`,
      data,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      },
    })
      .then(function (response) {
        const imageUrl = get(response, "data");

        if (imageUrl) {
          return imageUrl;
        }
        return null;
      })
      .catch(function (response) {
        console.log(response);
        return null;
      });
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export { pickImage, pickImageAndGetUrl };
