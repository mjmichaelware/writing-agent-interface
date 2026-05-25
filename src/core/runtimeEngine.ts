type Handler<T> = (data: T) => void;

class EventBus {
  private static instance: EventBus;
  private events: Record<string, Set<Handler<any>>> = {};

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) EventBus.instance = new EventBus();
    return EventBus.instance;
  }

  on<T>(event: string, handler: Handler<T>): () => void {
    if (!this.events[event]) this.events[event] = new Set();
    this.events[event].add(handler);
    return () => this.events[event].delete(handler);
  }

  off<T>(event: string, handler: Handler<T>) {
    this.events[event]?.delete(handler);
  }

  emit<T>(event: string, data: T) {
    this.events[event]?.forEach((handler) => handler(data));
  }
}

const bus = EventBus.getInstance();
export { bus };
export default bus;
export { EventBus };
