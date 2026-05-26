import React, { useEffect, useState } from "react";
import { ResponsiveRadar } from "@nivo/radar";
import { createClient } from "@supabase/supabase-js";
import styles from "./CinematicDashboard.module.css";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const TABLE = "writing_agent_console"; // Update with your actual console table name if needed

const CinematicAgentConsole: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from(TABLE)
      .select("agent_name,interaction_count,response_latency,status")
      .then((res) => {
        if (res.error) {
          setError(`Supabase error: ${res.error.message}`);
        } else if (Array.isArray(res.data) && res.data.length) {
          // Normalize radar chart data
          setData(res.data.map(row => ({
            agent: row.agent_name,
            Interactions: row.interaction_count,
            "Response Latency": row.response_latency,
            Status: row.status || "active"
          })));
        } else {
          setError("No readable data in writing_agent_console.");
        }
      });
  }, []);

  if (error) return <div className={styles.error}>{error}</div>;
  if (!data.length) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.cinematicRoot}>
      <h2 className={styles.heading}>Writing Agent Console: Live Metrics</h2>
      <div className={styles.chartContainer}>
        <ResponsiveRadar
          data={data}
          keys={["Interactions", "Response Latency"]}
          indexBy="agent"
          maxValue="auto"
          margin={{ top: 50, right: 80, bottom: 66, left: 60 }}
          curve="catmullRomClosed"
          borderWidth={3}
          borderColor={{ from: 'color' }}
          gridLevels={7}
          gridShape="circular"
          gridLabelOffset={28}
          enableDots={true}
          dotSize={14}
          dotColor={{ theme: 'background' }}
          dotBorderWidth={2}
          dotBorderColor={{ from: 'color' }}
          colors={{ scheme: 'nivo' }}
          fillOpacity={0.26}
          blendMode="multiply"
          animate={true}
          motionConfig="gentle"
          isInteractive={true}
          theme={{
            background: "#181824",
            textColor: "#fdf6e3",
            tooltip: {
              container: { background: "#202023", color: "#faeea8", borderRadius: 8 }
            }
          }}
          legends={[
            {
              anchor: "bottom-left",
              direction: "row",
              translateX: -30,
              translateY: 76,
              itemWidth: 120,
              itemHeight: 24,
              itemTextColor: "#fceb85",
              symbolSize: 20,
              symbolShape: "circle"
            }
          ]}
        />
      </div>
    </div>
  );
};

export default CinematicAgentConsole;
