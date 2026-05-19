export type DualismRecord = {
  id: string;
  term: string;
  parallel: string;
  note: string;
  chapters: string;
  para_index?: number;
};

export type ConcordanceRecord = {
  ref: string;
  title: string;
  passage: string;
  note: string;
  para_index?: number;
};

export type ArchetypeRecord = {
  name: string;
  character: string;
  description: string;
  development: string;
};

export type AgentResponse = {
  response?: string;
  result?: string;
  [key: string]: any;
};

export const AgentService = {
  async getDualisms(): Promise<DualismRecord[]> {
    try {
      const res = await fetch("/api/graph?type=dualisms");
      if (!res.ok) return [];
      const data = await res.json();
      return data.dualisms || data.nodes || [];
    } catch {
      return [];
    }
  },

  async searchConcordance(query: string): Promise<ConcordanceRecord[]> {
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=concordance`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.results || data.records || [];
    } catch {
      return [];
    }
  },

  async getArchetypes(): Promise<ArchetypeRecord[]> {
    try {
      const res = await fetch("/api/search?type=archetypes");
      if (!res.ok) return [];
      const data = await res.json();
      return data.archetypes || data.results || [];
    } catch {
      return [];
    }
  },

  async queryNarrative(prompt: string, context: string): Promise<AgentResponse> {
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, context }),
      });
      if (!res.ok) throw new Error(`Agent error: ${res.status}`);
      return await res.json();
    } catch (err) {
      throw err;
    }
  },
};
