export interface EMAWord {
  text: string;
  color?: string;
  font?: string;
  reference?: string;
  foreshadowing?: string;
  index: number;
}

export interface CompendiumEntry {
  id: string;
  archetype: string;
  triggers: string[];
  visualAsset: string;
  weight: number;
  historicalContext?: string;
  loreSummary?: string;
}

export interface Compendium {
  entities: CompendiumEntry[];
}
