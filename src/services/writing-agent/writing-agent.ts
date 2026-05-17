import { IWritingAgent, DraftSchema } from "@/core/IWritingAgent";

export class WritingAgent implements IWritingAgent {
  async execute(task: string, schema: DraftSchema): Promise<string> {
    return Promise.resolve("NOS Kernel Task Complete");
  }

  async validateConstraints(generatedText: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}
