import fs from 'fs';
import path from 'path';

export default async function Home() {
  const filePath = path.join(process.cwd(), 'data-layer', 'version-archive', 'ema_history.json');
  let historyData = {};
  
  try {
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      historyData = JSON.parse(fileContents);
    }
  } catch (e) {
    console.error("Error reading EMA history.");
  }

  // Convert the JSON object to an array and sort by total edits (descending)
  const files = Object.values(historyData).sort((a: any, b: any) => b.total_edits - a.total_edits);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Alitteras Narrative OS</h1>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
          Memory Engine: {files.length} indexed files. Ranked by Canonical Weight (EMA).
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {files.map((file: any) => (
            <div key={file.filename} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#1e293b', borderRadius: '0.5rem', border: '1px solid #334155' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{file.filename}</span>
              <span style={{ backgroundColor: '#1e3a8a', color: '#60a5fa', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {file.total_edits} Edits
              </span>
            </div>
          ))}
          
          {files.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', border: '1px dashed #334155', borderRadius: '0.5rem' }}>
              No history data found. Ensure ema_history.json exists.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
