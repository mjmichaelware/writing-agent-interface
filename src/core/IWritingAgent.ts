export interface IWritingAgent {
  execute(task: string): Promise<string>;
}
