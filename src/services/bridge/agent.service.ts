export type AgentResponse = {
  response?: string;
  result?: string;
  results?: unknown[];
  error?: string;
  status?: string;
};

export type ConcordanceRecord = {
  ref: string;
  title: string;
  note: string;
  passage?: string;
  content?: string;
  para_index?: number;
};

export type DualismRecord = {
  id: string;
  term: string;
  parallel: string;
  note: string;
  chapters: string;
  para_index?: number;
};

export type ArchetypeRecord = {
  name: string;
  character: string;
  description: string;
  development: string;
};

export const AgentService = {
  async queryNarrative(
    input: string,
    context: string
  ): Promise<AgentResponse> {
    const res = await fetch("/api/agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
        query: input,
        context,
      }),
    });

    if (!res.ok) {
      throw new Error("Agent kernel unreachable");
    }

    return res.json();
  },

  async searchConcordance(
    term: string
  ): Promise<ConcordanceRecord[]> {
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: term,
        }),
      });

      if (!res.ok) return [];

      const data = await res.json();

      const raw = Array.isArray(data?.results)
        ? data.results
        : [];

      return raw.map((item: any, index: number) => ({
        ref: String(item?.ref || `Node ${index + 1}`),
        title: String(
          item?.title ||
          item?.content?.slice?.(0, 64) ||
          "Untitled"
        ),
        note: String(
          item?.note ||
          item?.content ||
          ""
        ),
        passage: item?.passage
          ? String(item.passage)
          : undefined,
        content: item?.content
          ? String(item.content)
          : undefined,
        para_index: item?.para_index ?? undefined,
      }));
    } catch {
      return [];
    }
  },

  async getDualisms(): Promise<DualismRecord[]> {
    try {
      const res = await fetch("/api/graph?type=dualisms");

      if (!res.ok) return [];

      const data = await res.json();

      const raw = Array.isArray(data?.dualisms)
        ? data.dualisms
        : [];

      return raw.map((item: any, index: number) => ({
        id: String(item?.id || `dualism-${index}`),
        term: String(item?.term || ""),
        parallel: String(item?.parallel || ""),
        note: String(item?.note || ""),
        chapters: String(item?.chapters || ""),
        para_index: item?.para_index ?? undefined,
      }));
    } catch {
      return [];
    }
  },

  async getArchetypes(): Promise<ArchetypeRecord[]> {
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: "shadow persona anima self archetype",
        }),
      });

      if (!res.ok) return [];

      const data = await res.json();

      const raw = Array.isArray(data?.archetypes)
        ? data.archetypes
        : Array.isArray(data?.results)
          ? data.results
          : [];

      return raw.map((item: any, index: number) => ({
        name: String(
          item?.name ||
          item?.title ||
          `Archetype ${index + 1}`
        ),
        character: String(item?.character || ""),
        description: String(
          item?.description ||
          item?.note ||
          item?.content ||
          ""
        ),
        development: String(
          item?.development || ""
        ),
      }));
    } catch {
      return [];
    }
  },
};
