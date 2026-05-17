export type ArchetypePhase = "Pre-Descent" | "Zero-Point Descent" | "The Void" | "The Ascent";

export interface PsychologicalState {
  characterId: string;
  archetype: string;
  currentPhase: ArchetypePhase;
  somaticManifestation: string;
}

export interface IMemoryEngine {
  initialize(): Promise<void>;
  evaluateCharacterState(characterId: string, chapterIndex: number): Promise<PsychologicalState>;
}
