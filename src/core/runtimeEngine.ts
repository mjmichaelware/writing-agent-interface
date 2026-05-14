export type EventType = "chapter:load" | "block:render" | "scroll:update" | "state:change";
export type CommandType = "SET_CHAPTER" | "SET_MODE" | "ADVANCE_BLOCK";

export interface State {
  chapter: number;
  blockIndex: number;
  mode: "safe" | "cinematic";
}

export class EventBus {
  private listeners: Record<string, Function[]> = {};
  on(event: EventType, fn: Function) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(fn);
  }
  off(event: EventType, fn: Function) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(l => l !== fn);
  }
  emit(event: EventType, payload: any) {
    (this.listeners[event] || []).forEach(fn => fn(payload));
  }
}

export class RuntimeEngine {
  private state: State = { chapter: 7, blockIndex: 0, mode: "safe" };
  constructor(public events: EventBus) {}
  getState(): State { return { ...this.state }; }
  dispatch(command: { type: CommandType; payload?: any }) {
    switch (command.type) {
      case "SET_CHAPTER": this.state.chapter = command.payload; break;
      case "SET_MODE": this.state.mode = command.payload; break;
      case "ADVANCE_BLOCK":
        const dir = command.payload ?? 1;
        this.state.blockIndex = Math.max(0, this.state.blockIndex + dir);
        break;
    }
    this.events.emit("state:change", { ...this.state });
  }
}
