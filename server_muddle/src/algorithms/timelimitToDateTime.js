import moment from "moment";

const timelimitToDateTime = (timelimit) => {
  const arrTL = timelimit.split(" ");
  const objTL = {
    days: parseInt(arrTL[0], 10),
    hours: parseInt(arrTL[1], 10),
  };

  return moment().add(objTL);
};

export default timelimitToDateTime;
