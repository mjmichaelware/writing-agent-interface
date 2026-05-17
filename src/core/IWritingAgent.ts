export interface CompositionConstraints {
  enforceD4Law: boolean;
  enforceDahlRestraint: boolean;
  enforceSDP: boolean;
  enforceNegationRhetoric: boolean;
}

export interface DraftSchema {
  promptTarget: string;
  constraints: CompositionConstraints;
  contextNodes: string[];
}

export interface IWritingAgent {
  execute(task: string, schema: DraftSchema): Promise<string>;
  validateConstraints(generatedText: string): Promise<boolean>;
}
