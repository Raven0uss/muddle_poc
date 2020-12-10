// import { configureFonts, DefaultTheme } from "react-native-paper";
import customFonts from "./Fonts";

// const theme = {
//   ...DefaultTheme,
//   fonts: configureFonts(customFonts),
//   roundness: 30,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: "#000000",
//     secondary: "#F47658",
//     accent: "#f1c40f",
//     favorite: "#BADA55",
//     cancelButton: "#a4c639",
//     iconColor: "#808080",
//   },
// }

const themeSchema = {
  light: {
    backgroundInput1: "#FFFFFF",
    colorText: "#000000",
    colorText2: "#F7F7F7",
    colorText3: "#FFFFFF",
    backgroundColor1: "#F7F7F7",
    backgroundColor2: "#FFFFFF",
    hrLineColor: "#DBDBDB",
    // buttonChoiceBackgroundColor: "#FFFFFF",
    // buttonChoiceColor: "#000000",
  },
  dark: {
    backgroundInput1: "#000000",
    colorText: "#FFFFFF",
    colorText2: "#2F3134",
    colorText3: "#000000",
    backgroundColor1: "#2F3134",
    backgroundColor2: "#111",
    hrLineColor: "#FFFFFF",
    // buttonChoiceBackgroundColor: "#000000",
    // buttonChoiceColor: "#FFFFFF",
  },
};

export default themeSchema;
