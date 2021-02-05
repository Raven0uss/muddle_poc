import moment from "moment";
import i18n from "../i18n";

const is12Format = (language) => {
  switch (language) {
    case "fr":
      return false;
    case "en":
      return true;
    default:
      return false;
  }
};

const getDateMessage = (date) => {
  const now = moment();
  const from = moment(date);

  const format12 = is12Format(i18n.language);
  if (moment(date).isSame(now, "day")) {
    return format12 ? from.format("HH:mm A") : from.format("HH[h]mm");
  }
  const yesterday = moment().subtract(1, "days");
  if (moment(date).isSame(yesterday, "day")) {
    return `${i18n._("yesterday")} ${
      format12 ? from.format("HH:mm A") : from.format("HH[h]mm")
    }`;
  }

  const year = moment().format("YYYY");

  if (year === from.format("YYYY"))
    return `${from.format("ddd DD MMM")} - ${
      format12 ? from.format("HH:mm A") : from.format("HH[h]mm")
    }`;
  return from.format("ddd DD MMM YYYY");
};

export default getDateMessage;
