import { AsyncStorage } from "react-native";

// Les methodes de l'AsyncStorage peuvent avoir en second parametre une callback

const storeItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    return value;
  } catch (error) {
    console.error("An issue occurred with storeItem : ", error);
    return null;
  }
};

const getItem = async (key) => {
  try {
    const item = await AsyncStorage.getItem(key);
    return item;
  } catch (error) {
    console.error("An issue occurred with getItem : ", error);
    return null;
  }
};

const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return;
  } catch (error) {
    console.error("An issue occurred with getItem : ", error);
    return null;
  }
};

export { storeItem, getItem, removeItem };
