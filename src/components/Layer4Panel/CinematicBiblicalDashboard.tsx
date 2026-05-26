import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { createClient } from "@supabase/supabase-js";
import styles from "./CinematicDashboard.module.css";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const TABLE = "biblical_references";

const CinematicBiblicalDashboard: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from(TABLE)
      .select("book,chapter,verse,count")
      .then((res) => {
        if (res.error) {
          setError(`Supabase error: ${res.error.message}`);
        } else if (Array.isArray(res.data)) {
          // Make bar chart data
          setData(res.data.map(row => ({
            book: row.book,
            ref: `${row.book} ${row.chapter}:${row.verse}`,
            count: row.count || 1,
          })));
        } else {
          setError("No readable data in biblical_references.");
        }
      });
  }, []);

  if (error) return <div className={styles.error}>{error}</div>;
  if (!data.length) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.cinematicRoot}>
      <h2 className={styles.heading}>Biblical References Activity</h2>
      <div className={styles.chartContainer}>
        <ResponsiveBar
          data={data}
          keys={["count"]}
          indexBy="ref"
          margin={{ top: 40, right: 32, bottom: 80, left: 80 }}
          padding={0.35}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={{ scheme: 'set3' }}
          borderColor={{ from: 'color', modifiers: [['darker', 1.2]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 8,
            tickPadding: 7,
            tickRotation: 45,
            legend: 'Reference',
            legendPosition: 'middle',
            legendOffset: 60
          }}
          axisLeft={{
            tickSize: 9,
            tickPadding: 8,
            tickRotation: 0,
            legend: 'Citations',
            legendPosition: 'middle',
            legendOffset: -56
          }}
          theme={{
            tooltip: { container: { background: "#2c253f", color: "#ffeeb3" } },
            axis: {
              ticks: {
                text: { fill: "#edd19d" },
                line: { stroke: "#edd19d" }
              },
              legend: {
                text: { fill: "#ffeeb3" }
              }
            },
            grid: {
              line: { stroke: "#d5d1bf40" }
            }
          }}
          labelSkipWidth={18}
          labelSkipHeight={16}
          labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          isInteractive={true}
          animate={true}
          motionConfig="gentle"
          groupMode="grouped"
        />
      </div>
    </div>
  );
};

export default CinematicBiblicalDashboard;
