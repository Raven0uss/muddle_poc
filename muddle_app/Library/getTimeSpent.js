import moment from "moment";
import i18n from "../i18n";

const getTimeSpent = (date) => {
  const now = moment();
  const from = moment(date);

  const seconds = now.diff(from, "seconds");
  if (seconds <= 59) {
    return i18n._("nowAgo");
  }
  const minutes = now.diff(from, "minutes");
  if (minutes <= 59) {
    return i18n._("minutesAgo", {
      time: minutes,
    });
  }
  const hours = now.diff(from, "hours");
  if (hours <= 23) {
    return i18n._("hoursAgo", {
      time: hours,
    });
  }
  const days = now.diff(from, "days");
  if (days <= 6) {
    return i18n._("daysAgo", {
      time: days,
    });
  }
  return i18n._("moreOneWeekAgo");
};

export default getTimeSpent;
