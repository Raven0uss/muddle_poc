import React from "react";
import {
  Platform,
  View,
  Button,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Text,
  Modal,
  Dimensions,
  StyleSheet,
  ScrollView,
  ActionSheetIOS,
} from "react-native";
import PropTypes from "prop-types";
import i18n from "../i18n";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";
import { isNil } from "lodash";

const { width, height } = Dimensions.get("window");

const Select = (props) => {
  const { theme } = React.useContext(ThemeContext);
  const [visible, setVisible] = React.useState(false);
  const {
    list: propList,
    selected,
    placeholder,
    onSelect,
    renderComponent,
  } = props;

  const list = propList.filter((l) => !isNil(l));
  const onPress = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [...[i18n._("cancel")], ...list.map((l) => l.label)],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        console.log(buttonIndex);
        if (buttonIndex === 0) {
          setVisible((v) => !v);
        } else {
          setVisible((v) => !v);
          onSelect(list[buttonIndex - 1]);
        }
      }
    );
  };

  return (
    <View style={{ width: "100%" }}>
      {renderComponent === undefined ? (
        <TouchableWithoutFeedback
          onPress={() => {
            setVisible((v) => !v);
            if (Platform.OS === "ios") onPress();
          }}
        >
          <View
            style={{
              ...styles.input,
              backgroundColor: themeSchema[theme].backgroundColor2,
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat_500Medium",
                color: themeSchema[theme].colorText,
              }}
            >
              {selected === null ? placeholder : selected.label}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <TouchableOpacity
          onPress={() => {
            setVisible((v) => !v);
            if (Platform.OS === "ios") onPress();
          }}
        >
          {props.renderComponent}
        </TouchableOpacity>
      )}
      {visible && Platform.OS !== "ios" && (
        <Modal animationType="fade" transparent visible={visible}>
          <TouchableHighlight
            onPress={() => setVisible(false)}
            style={[styles.mask]}
            underlayColor="transparent"
          >
            <Text />
          </TouchableHighlight>
          <View style={styles.centeredView}>
            <View
              style={{
                backgroundColor: "transparent",
                padding: 10,
                // elevation: 5,
                borderRadius: 5,
                margin: 10,
              }}
            >
              <ScrollView style={{ marginBottom: 10 }}>
                {list.map((element) => {
                  if (isNil(element)) return null;
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        onSelect(element);
                        setVisible(false);
                      }}
                      style={{
                        ...styles.validationButton,
                        marginTop: 4,
                      }}
                    >
                      <Text
                        style={{
                          // padding: 10,
                          fontSize: 14,
                          fontFamily: "Montserrat_500Medium",
                          color: "#FFFFFF",
                          textAlign: "center",
                        }}
                      >
                        {element.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                }}
                style={{
                  ...styles.validationButton,
                  // backgroundColor: themeSchema[theme].colorText,
                  alignItems: "center",
                  backgroundColor: "#000000ee",
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontFamily: "Montserrat_700Bold",
                    fontSize: 14,
                  }}
                >
                  {i18n._("cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

Select.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.oneOf([
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
      null,
    ])
  ).isRequired,
  selected: PropTypes.oneOf([
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    null,
  ]),
  placeholder: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  renderComponent: PropTypes.any,
};

Select.defaultProps = {
  placeholder: "",
  renderComponent: undefined,
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    padding: 12,
    paddingLeft: 20,
    paddingRight: 20,
    width: "100%",
    borderRadius: 10,
    color: "#000",
    marginBottom: 10,
    height: 40,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  validationButton: {
    backgroundColor: "#000000e8",
    padding: 12,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 14,
    width: width / 1.2,
    alignSelf: "center",
  },
  mask: {
    justifyContent: "center",
    backgroundColor: "#383838",
    opacity: 0.3,
    position: "absolute",
    width: width,
    height: height,
    left: 0,
    bottom: 0,
  },
});

export default Select;
