import { configureFonts, DefaultTheme } from "react-native-paper";
import customFonts from "./Fonts";

const theme = {
  ...DefaultTheme,
  fonts: configureFonts(customFonts),
  roundness: 30,
  colors: {
    ...DefaultTheme.colors,
    primary: "#000000",
    secondary: "#F47658",
    accent: "#f1c40f",
    favorite: "#BADA55",
    cancelButton: "#a4c639",
    iconColor: "#808080",
  },
};

export default theme;
