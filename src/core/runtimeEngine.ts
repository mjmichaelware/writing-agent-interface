export type RuntimeEvents = {
  "scroll:focus": { paraIndex: string };
  "nav:velocity_scroll": { speed: number };
  "ui:menu_toggle": { isOpen: boolean };
};

type Handler<K extends keyof RuntimeEvents> = (payload: RuntimeEvents[K]) => void;

class EventBus {
  private static instance: EventBus;

  private events: {
    [K in keyof RuntimeEvents]?: Set<Handler<K>>;
  } = {};

  private constructor() {}

  static getInstance() {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  on<K extends keyof RuntimeEvents>(event: K, fn: Handler<K>) {
    if (!this.events[event]) {
      this.events[event] = new Set();
    }

    this.events[event]!.add(fn);

    return () => this.off(event, fn);
  }

  off<K extends keyof RuntimeEvents>(event: K, fn: Handler<K>) {
    const handlers = this.events[event];
    if (!handlers) return;

    handlers.delete(fn);

    if (handlers.size === 0) {
      delete this.events[event];
    }
  }

  emit<K extends keyof RuntimeEvents>(event: K, payload: RuntimeEvents[K]) {
    const handlers = this.events[event];
    if (!handlers) return;

    for (const fn of handlers) {
      try {
        fn(payload);
      } catch (err) {
        console.error(`[bus:${event}]`, err);
      }
    }
  }
}

export const bus = EventBus.getInstance();
export { EventBus };
export default bus;
