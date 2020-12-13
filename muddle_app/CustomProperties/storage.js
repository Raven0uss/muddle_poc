import { AsyncStorage, Platform } from "react-native";

// Les methodes de l'AsyncStorage peuvent avoir en second parametre une callback

const storeItem = async (key, value) => {
  try {
    if (Platform.OS === "web") {
      const webResult = localStorage.setItem(key, value);
      return webResult;
    } else {
      const result = await AsyncStorage.setItem(key, value);
      return result;
    }
  } catch (error) {
    console.error("An issue occurred with storeItem : ", error);
    return null;
  }
};

const getItem = async (key) => {
  try {
    if (Platform.OS === "web") {
      const webItem = localStorage.getItem(key);
      return webItem;
    } else {
      const item = await AsyncStorage.getItem(key);
      return item;
    }
  } catch (error) {
    console.error("An issue occurred with getItem : ", error);
    return null;
  }
};

const removeItem = async (key) => {
  try {
    if (Platform.OS === "web") {
      const webResult = localStorage.removeItem(key);
      return webResult;
    } else {
      const result = await AsyncStorage.removeItem(key);
      return result;
    }
  } catch (error) {
    console.error("An issue occurred with getItem : ", error);
    return null;
  }
};

export { storeItem, getItem, removeItem };
