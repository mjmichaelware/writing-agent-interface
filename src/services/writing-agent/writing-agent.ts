import { IWritingAgent } from "@/core/IWritingAgent";

export class WritingAgent implements IWritingAgent {
  async execute(task: string): Promise<string> {
    return Promise.resolve("NOS Kernel Task Complete");
  }
}
