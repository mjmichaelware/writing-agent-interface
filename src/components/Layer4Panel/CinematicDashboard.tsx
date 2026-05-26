import React, { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import { createClient } from "@supabase/supabase-js";
import styles from "./CinematicDashboard.module.css";

// Environment variables required: see README for secure setup instructions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const TABLE = "dualism_map"; // Change as needed—auto-detect coming in v2

const CinematicDashboard: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from(TABLE)
      .select("*")
      .then((res) => {
        if (res.error) {
          setError(`Supabase error: ${res.error.message}`);
        } else if (Array.isArray(res.data)) {
          // Attempt to auto-shape data for a line chart—edit this mapping for your structure
          const chartData = [
            {
              id: "Dualism Strength",
              color: "hsl(45, 96%, 54%)",
              data: res.data.map((row, i) => ({
                x: row.label || row.id || i + 1,
                y: row.strength || row.value || row.score || 0,
              })),
            },
          ];
          setData(chartData);
        } else {
          setError("No readable data in dualism_map.");
        }
      });
  }, []);

  if (error) return <div className={styles.error}>{error}</div>;
  if (!data.length) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.cinematicRoot}>
      <h2 className={styles.heading}>
        Dualism Map Cinematic Dashboard
      </h2>
      <div className={styles.chartContainer}>
        <ResponsiveLine
          data={data}
          theme={{
            background: "#141416",
            textColor: "#fdf6e3",
            axis: {
              domain: { line: { stroke: "#ecc264" }, },
              ticks: {
                line: { stroke: "#ecc264", strokeWidth: 1 },
                text: { fill: "#ffeeb3" }
              },
              legend: {
                text: { fill: "#ffeeb3" }
              }
            },
            grid: {
              line: { stroke: "#33334d", strokeDasharray: "4 2" }
            },
            tooltip: {
              container: { background: "#181926", color: "#ffeeb3", borderRadius: 8 }
            }
          }}
          margin={{ top: 32, right: 48, bottom: 48, left: 56 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: false,
            reverse: false
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            tickSize: 8,
            tickPadding: 8,
            tickRotation: 0,
            legend: "Label",
            legendOffset: 36,
            legendPosition: "middle"
          }}
          axisLeft={{
            orient: "left",
            tickSize: 8,
            tickPadding: 8,
            tickRotation: 0,
            legend: "Strength",
            legendOffset: -40,
            legendPosition: "middle"
          }}
          enableGridX={false}
          enableGridY={true}
          lineWidth={5}
          pointSize={18}
          pointColor={{ theme: "background" }}
          pointBorderWidth={4}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-16}
          useMesh={true}
          animate={true}
          motionConfig="wobbly"
          legends={[
            {
              anchor: "top-left",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: -24,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 110,
              itemHeight: 26,
              itemOpacity: 0.92,
              symbolSize: 22,
              symbolShape: "circle",
              symbolBorderColor: "rgba(238, 202, 100, .8)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "#302940",
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
        />
      </div>
    </div>
  );
};

export default CinematicDashboard;
