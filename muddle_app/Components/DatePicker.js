import React from "react";
import {
  Platform,
  View,
  Button,
  TouchableWithoutFeedback,
  TextInput,
  Text,
  StyleSheet,
} from "react-native";
import PropTypes from "prop-types";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

const DatePicker = (props) => {
  const [show, setShow] = React.useState(false);
  const { date, onDateChange } = props;

  moment.locale("fr"); // Have to dynamise

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios"); // To keep open the DatePicker on iOS
    onDateChange(currentDate);
  };

  // Put the DateTimePicker in modal for iOS

  return (
    <View>
      <TouchableWithoutFeedback
        onPress={() => {
          setShow((bool) => !bool);
        }}
      >
        <View style={styles.input}>
          <Text>{moment(date).format("DD MMMM YYYY")}</Text>
        </View>
      </TouchableWithoutFeedback>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={"date"}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

DatePicker.propTypes = {
  onDateChange: PropTypes.func.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
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
  },
});

export default DatePicker;
