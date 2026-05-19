type Handler<T> = (data: T) => void;

class EventBus {
  private static instance: EventBus;
  private events: Record<string, Set<Handler<any>>> = {};

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  on<T>(event: string, handler: Handler<T>) {
    if (!this.events[event]) {
      this.events[event] = new Set();
    }
    this.events[event].add(handler);
    return () => this.events[event].delete(handler);
  }

  emit<T>(event: string, data: T) {
    if (this.events[event]) {
      this.events[event].forEach((handler) => handler(data));
    }
  }
}

const bus = EventBus.getInstance();
export { bus }; // Named export for components
export default bus; // Default export for compatibility
export { EventBus };
