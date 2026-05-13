export type EventType =
  | "chapter:load"
  | "block:render"
  | "scroll:update"
  | "state:change";

export type CommandType =
  | "SET_CHAPTER"
  | "SET_MODE"
  | "ADVANCE_BLOCK";

export class EventBus {
  private listeners: Record<string, Function[]> = {};

  on(event: EventType, fn: Function) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(fn);
  }

  emit(event: EventType, payload: any) {
    (this.listeners[event] || []).forEach(fn => fn(payload));
  }
}

export interface State {
  chapter: number;
  blockIndex: number;
  mode: "safe" | "cinematic";
}

export class RuntimeEngine {
  private state: State = {
    chapter: 7,
    blockIndex: 0,
    mode: "safe",
  };

  constructor(public events: EventBus) {}

  getState() {
    return this.state;
  }

  dispatch(command: { type: CommandType; payload?: any }) {
    switch (command.type) {
      case "SET_CHAPTER":
        this.state.chapter = command.payload;
        break;
      case "SET_MODE":
        this.state.mode = command.payload;
        break;
      case "ADVANCE_BLOCK":
        const direction = command.payload ?? 1;
        this.state.blockIndex = Math.max(0, this.state.blockIndex + direction);
        break;
    }
    this.events.emit("state:change", this.state);
  }
}
