import { DraftSchema } from "@/core/IWritingAgent";

export type AgentResponse = { response?: string; results?: any[]; archetypes?: any[]; dualisms?: any[]; result?: string };
export type DualismRecord = { id: string; term: string; parallel: string; note: string; chapters: string; para_index?: number; };
export type ArchetypeRecord = { name: string; character: string; description: string; development: string; };
export type ConcordanceRecord = { ref: string; title: string; note: string; passage?: string; content?: string; para_index?: number; };

export const AgentService = {
  async queryNarrative(input: string, context: string): Promise<AgentResponse> {
    const res = await fetch("/api/agent", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input, context }) 
    });
    return res.json();
  },
  async searchConcordance(term: string): Promise<ConcordanceRecord[]> {
    const res = await fetch("/api/search", { method: "POST", body: JSON.stringify({ query: term }) });
    const data = await res.json();
    return (data.results || []).map((i: any) => ({ ...i, ref: i.ref || "Node", para_index: i.para_index }));
  },
  async getDualisms(): Promise<DualismRecord[]> {
    const res = await fetch("/api/graph?type=dualisms");
    const data = await res.json();
    return (data.dualisms || []).map((i: any) => ({ ...i, para_index: i.para_index }));
  },
  async getArchetypes(): Promise<ArchetypeRecord[]> {
    const res = await fetch("/api/search", { method: "POST", body: JSON.stringify({ query: "archetype" }) });
    const data = await res.json();
    return (data.archetypes || data.results || []).map((i: any) => ({ 
      name: i.name || i.title || "Unknown", 
      character: i.character || "", 
      description: i.description || i.content || "", 
      development: i.development || "" 
    }));
  },
  async executeAgentTask(task: string, schema: DraftSchema): Promise<string> {
    const res = await fetch("/api/agent", { 
        method: "POST", 
        body: JSON.stringify({ prompt: task, context: schema.contextNodes.join("\n") }) 
    });
    const data = await res.json();
    return data.response || data.result || "";
  }
};
