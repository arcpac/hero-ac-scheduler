import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

const chartSetting = {
  width: 600,
  height: 400,
};

const BarAnimation = ({ holidaysPerJurisdiction }) => {
  if (!holidaysPerJurisdiction || !Array.isArray(holidaysPerJurisdiction)) {
    console.error(
      "Invalid or undefined holidaysPerJurisdiction data:",
      holidaysPerJurisdiction
    );
    return <div>Error: Invalid or undefined data</div>;
  }

  const officialDataset = holidaysPerJurisdiction.map((entry) => ({
    jurisdiction: entry.jurisdiction,
    officialHolidays: entry.officialCount,
  }));

  const customDataset = holidaysPerJurisdiction.map((entry) => ({
    jurisdiction: entry.jurisdiction,
    customHolidays: entry.customCount,
  }));

  if (officialDataset.length === 0 && customDataset.length === 0) {
    return <div className="text-dark">No holidays data available</div>;
  }

  const allJurisdictions = [
    ...new Set([
      ...officialDataset.map((entry) => entry.jurisdiction),
      ...customDataset.map((entry) => entry.jurisdiction),
    ]),
  ];

  return (
    <ResponsiveContainer width="100%" height={chartSetting.height}>
      <BarChart
        data={allJurisdictions.map((jurisdiction) => ({
          jurisdiction: jurisdiction.toUpperCase(),
          officialHolidays:
            officialDataset.find((entry) => entry.jurisdiction === jurisdiction)
              ?.officialHolidays || 0,
          customHolidays:
            customDataset.find((entry) => entry.jurisdiction === jurisdiction)
              ?.customHolidays || 0,
        }))}
        margin={{ top: 50, right: 30, left: 0, bottom: 20 }}
        className="my-2"
      >
        <XAxis
          dataKey="jurisdiction"
          axisLine={{ stroke: "#ccc", strokeWidth: 1, strokeDasharray: "3 3" }}
        />
        <YAxis
          axisLine={{ stroke: "#ccc", strokeWidth: 1, strokeDasharray: "3 3" }}
        />
        <Tooltip />
        <Legend
          payload={[
            {
              value: "Official Holidays",
              type: "rect",
              id: "officialHolidays",
              color: "#3C50E0",
            },
            {
              value: "Custom Holidays",
              type: "rect",
              id: "customHolidays",
              color: "#80CAEE",
            },
          ]}
          formatter={(value) => <span className="text-dark">{value}</span>}
        />
        {allJurisdictions.map((jurisdiction, index) => (
          <ReferenceLine
            key={index}
            x={jurisdiction}
            stroke="#ccc"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        ))}

        <Bar
          dataKey="officialHolidays"
          name="Official Holidays"
          fill="#3C50E0"
          barSize={20}
        />
        <Bar
          dataKey="customHolidays"
          name="Custom Holidays"
          fill="#80CAEE"
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarAnimation;
