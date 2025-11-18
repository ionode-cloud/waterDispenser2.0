import React, { useLayoutEffect, useRef } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_india2019High from "@amcharts/amcharts4-geodata/india2019High";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import '../App.css';

am4core.useTheme(am4themes_animated);

const IndiaMap = () => {
  const chartRef = useRef(null);

  useLayoutEffect(() => {

    const chart = am4core.create("chartdiv", am4maps.MapChart);
    chartRef.current = chart;


    chart.geodata = am4geodata_india2019High;
    chart.projection = new am4maps.projections.Miller();


    const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;

    polygonSeries.mapPolygons.template.fill = am4core.color("#61cfcfff");

    polygonSeries.mapPolygons.template.propertyFields.fill = "fill";
    polygonSeries.data = [
      { id: "IN-JK" },
      { id: "IN-MH" },
      { id: "IN-UP" },
      { id: "IN-RJ" },
      { id: "IN-AP" },
      { id: "IN-MP" },
      { id: "IN-TN" },
      { id: "IN-JH" },
      { id: "IN-WB" },
      { id: "IN-GJ" },
      { id: "IN-BR" },
      { id: "IN-TG" },
      { id: "IN-GA" },
      { id: "IN-DN" },
      { id: "IN-DL" },
      { id: "IN-DD" },
      { id: "IN-CH" },
      { id: "IN-CT" },
      { id: "IN-AS" },
      { id: "IN-AR" },
      { id: "IN-AN" },
      { id: "IN-KA" },
      { id: "IN-KL" },
      { id: "IN-OR", fill: am4core.color("#FF6F00") },
      { id: "IN-SK" },
      { id: "IN-HP" },
      { id: "IN-PB" },
      { id: "IN-HR" },
      { id: "IN-UT" },
      { id: "IN-LK" },
      { id: "IN-MN" },
      { id: "IN-TR" },
      { id: "IN-MZ" },
      { id: "IN-NL" },
      { id: "IN-ML" },
    ];

    const polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.strokeWidth = 0.5;

    const hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#4d9caeff");

    return () => {
      chart.dispose();
    };
  }, []);

  return (
    <div
      id="chartdiv"
      className="Ind"
      style={{
          width: "100%",
          height: "450px",
      }}
    >
    </div >
  );
};

export default IndiaMap;
