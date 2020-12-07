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
  StyleSheet,
  Dimensions,
} from "react-native";
import PropTypes from "prop-types";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import "moment/locale/en-gb";
import "moment/locale/fr";
import i18n from "../i18n";

const { width, height } = Dimensions.get("window");

const DatePicker = (props) => {
  const [show, setShow] = React.useState(false);
  const { date, onDateChange, placeholder } = props;
  const locale = i18n.language;

  moment.locale(locale);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios"); // To keep open the DatePicker on iOS
    onDateChange(currentDate);
  };

  return (
    <View style={{ width: "100%" }}>
      <TouchableWithoutFeedback
        onPress={() => {
          setShow((bool) => !bool);
        }}
      >
        <View style={styles.input}>
          <Text
            style={{
              fontFamily: "Montserrat_500Medium",
            }}
          >
            {date === null ? placeholder : moment(date).format("DD MMMM YYYY")}
          </Text>
        </View>
      </TouchableWithoutFeedback>
      {Platform.OS === "ios" && show && (
        <Modal animationType="fade" transparent visible={show}>
          <TouchableHighlight
            onPress={() => setShow(false)}
            style={[styles.mask]}
            underlayColor="transparent"
          >
            <Text />
          </TouchableHighlight>
          <View style={styles.centeredView}>
            <View
              style={{
                backgroundColor: "#fff",
                padding: 10,
                elevation: 5,
                borderRadius: 5,
                margin: 10,
              }}
            >
              <DateTimePicker
                testID="dateTimePicker"
                value={date || new Date()}
                mode="date"
                locale={locale}
                display="default"
                onChange={onChange}
              />
              <TouchableOpacity
                onPress={() => {
                  setShow(false);
                }}
                style={styles.validationButton}
              >
                <Text
                  style={{ color: "#FFF", fontFamily: "Montserrat_700Bold" }}
                >
                  {i18n._("confirm")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      {Platform.OS === "android" && show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date || new Date()}
          mode={"date"}
          locale={locale}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

// date null have to solve proptypes

DatePicker.propTypes = {
  onDateChange: PropTypes.func.isRequired,
  date: PropTypes.oneOf([PropTypes.instanceOf(Date).isRequired, null])
    .isRequired,
  placeholder: PropTypes.string,
};

DatePicker.defaultProps = {
  placeholder: "",
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
    marginBottom: 18,
    height: 40,
    fontFamily: "Montserrat_500Medium",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
  },
  validationButton: {
    backgroundColor: "#000",
    padding: 12,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 30,
    width: 112,
    alignSelf: "center",
  },
  mask: {
    justifyContent: "center",
    backgroundColor: "#383838",
    opacity: 0.8,
    position: "absolute",
    width: width,
    height: height,
    left: 0,
    top: 0,
  },
});

export default DatePicker;
