import React, { useEffect, useState } from "react";
import { ResponsiveNetwork } from "@nivo/network";
import { createClient } from "@supabase/supabase-js";
import styles from "./CinematicDashboard.module.css";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const TABLE = "hyperlinks";

const CinematicHyperlinksDashboard: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from(TABLE)
      .select("id,source,target,label,weight")
      .then((res) => {
        if (res.error) {
          setError(`Supabase error: ${res.error.message}`);
        } else if (Array.isArray(res.data) && res.data.length) {
          // Build network chart data format for Nivo
          const nodesMap = {};
          const links: any[] = [];
          res.data.forEach(row => {
            if(!nodesMap[row.source]) nodesMap[row.source] = { id: row.source, label: row.source, color: "#eaba63" };
            if(!nodesMap[row.target]) nodesMap[row.target] = { id: row.target, label: row.target, color: "#74ddfc" };
            links.push({ source: row.source, target: row.target, distance: row.weight || 15 });
          });
          const nodes = Object.values(nodesMap);
          setData({ nodes, links });
        } else {
          setError("No readable data in hyperlinks.");
        }
      });
  }, []);

  if (error) return <div className={styles.error}>{error}</div>;
  if (!data) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.cinematicRoot}>
      <h2 className={styles.heading}>Hyperlink Dualism Network</h2>
      <div className={styles.chartContainer}>
        <ResponsiveNetwork
          data={data}
          linkDistance={function(e){ return e.distance || 22; }}
          centeringStrength={0.5}
          repulsivity={8}
          iterations={120}
          nodeSize={18}
          activeNodeSize={28}
          nodeColor={d=>d.color}
          nodeBorderWidth={3}
          nodeBorderColor={d => d.color === '#eaba63' ? '#fff6cb' : '#cbfff6'}
          linkThickness={d=>2}
          linkColor="#deb13f"
          motionConfig="wobbly"
          label={d=>d.label}
          isInteractive={true}
          tooltip={d => <div style={{ background: "#221526", color: "#ffeeb3", borderRadius: 9, padding: "6px 8px" }}>{d.id}</div>}
          theme={{
            labels: { text: { fill: "#ffeeb3" } },
            background: "#1e162d"
          }}
        />
      </div>
    </div>
  );
};

export default CinematicHyperlinksDashboard;
