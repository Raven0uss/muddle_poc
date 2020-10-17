import { Platform, NativeModules } from "react-native";

const { StatusBarManager } = NativeModules;

const getStatusBarHeight = () => {
  try {
    const gap = Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT;
    return gap;
  } catch (err) {
    return 0;
  }
};

export default getStatusBarHeight;
