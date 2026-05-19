export type AgentResponse = {
  response?: string;
  result?: string;
  results?: unknown[];
  error?: string;
  status?: string;
};

export const AgentService = {
  async queryNarrative(input: string, context: string): Promise<AgentResponse> {
    const res = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: input, input, context, sessionId: "main" }),
    });

    if (!res.ok) {
      throw new Error("Agent Kernel unreachable");
    }

    return res.json();
  },

  async searchConcordance(term: string): Promise<AgentResponse> {
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: term }),
    });

    if (!res.ok) {
      throw new Error("Concordance search unreachable");
    }

    return res.json();
  },
};
