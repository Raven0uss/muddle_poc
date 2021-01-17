import React from "react";
import { useTheme } from "@material-ui/core/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Title from "./Title";
import moment from "moment";
import Grid from "@material-ui/core/Grid";
import "moment/locale/fr";
import { gql, useQuery } from "@apollo/client";
import { Button } from "@material-ui/core";

// Generate Sales Data
function createData(time, users) {
  return { time, Connexions: users };
}

function filterData(currentData, filterDate) {
  // const today = moment().format("DD/MM/YYYY");
  const objectData = {};
  const filterData = [];
  for (let i = 0; i < currentData.length; i++) {
    const element = currentData[i];
    objectData[element.time] = element.Connexions;
  }
  let index = 6;
  if (filterDate === "month") index = 30;
  if (filterDate === "year") index = 365;
  while (index >= 0) {
    const key = moment().subtract(index, "days").format("DD/MM/YYYY");
    if (key in objectData === false) {
      filterData.push(createData(key, 0));
    } else {
      filterData.push(createData(key, objectData[key]));
    }
    index--;
  }
  return filterData;
}

const GET_CONNECTED_STATS = gql`
  query {
    connecteds {
      id
      connections {
        id
      }
    }
  }
`;

// const data = [
//   createData("Lundi", 430),
//   createData("Mardi", 300),
//   createData("Mercredi", 500),
//   createData("Jeudi", 400),
//   createData("Vendredi", 1500),
//   createData("Samedi", undefined),
//   createData("Dimanche", undefined),
// ];

//The pixel bounds for the LineChart, 0,0 is the top left corner
// these were found using the inspector built into the web browser
// these are in pixels but correspond to the values used in your graph
// so 246 is 0 Y on the graph and 5 is 10000 Y on the graph (according to your data)
const chartBoundsY = { min: 246, max: 5 };

// The bounds we are using for the chart
const chartMinMaxY = { min: 0, max: 10000 };

// Convert the pixel value from the cursor to the scale used in the chart
const remapRange = (value) => {
  let fromAbs = value - chartBoundsY.min;
  let fromMaxAbs = chartBoundsY.max - chartBoundsY.min;

  let normal = fromAbs / fromMaxAbs;

  let toMaxAbs = chartMinMaxY.max - chartMinMaxY.min;
  let toAbs = toMaxAbs * normal;

  return Math.ceil(toAbs + chartMinMaxY.min);
};

export default function Chart() {
  const [filterDate, setFilterDate] = React.useState("week");
  const theme = useTheme();

  const { data: dataStatistiques, loading, error } = useQuery(
    GET_CONNECTED_STATS
  );

  moment.locale("fr");
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Oops, une erreur est survenue</div>;
  const dataNotFiltered = dataStatistiques.connecteds
    .filter((d) => moment().diff(d.date, "days") <= 7)
    .map((d) =>
      createData(moment(d.date).format("DD/MM/YYYY"), d.connections.length)
    );
  let data = dataNotFiltered;
  if (dataNotFiltered.length < 7)
    data = filterData(dataNotFiltered, filterDate);
  return (
    <React.Fragment>
      <div style={{ marginBottom: 20, paddingLeft: 5 }}>
        <h3>
          {moment().format("DD MMMM YYYY")} -{" "}
          {filterDate === "week"
            ? "Semaine"
            : filterDate === "month"
            ? "Mois"
            : "Année"}
        </h3>

        <Grid container spacing={3}>
          <button
            style={{ marginLeft: 3, marginRight: 3 }}
            onClick={() => setFilterDate("week")}
            disabled={filterDate === "week"}
          >
            Semaine
          </button>
          <button
            style={{ marginLeft: 3, marginRight: 3 }}
            onClick={() => setFilterDate("month")}
            disabled={filterDate === "month"}
          >
            Mois
          </button>
          <button
            style={{ marginLeft: 3, marginRight: 3 }}
            onClick={() => setFilterDate("year")}
            disabled={filterDate === "year"}
          >
            Année
          </button>
        </Grid>
      </div>
      <hr
        style={{
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "#ececec",
          width: "100%",
        }}
      />
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
          onMouseMove={(props) => {
            // We get the values passed into the onMouseMove event
            if (props.isTooltipActive) {
              // If the tooltip is active then we display the Y value
              // under the mouse using our custom mapping
              // console.log(remapRange(props.chartY));
            }
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}></YAxis>
          <Line type="monotone" dataKey="Connexions" stroke={"#000"} dot />
          <Tooltip
          // content={() =>}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
