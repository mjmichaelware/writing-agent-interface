class EventBus {
  private static instance: EventBus;
  private listeners: Map<string, Set<(payload: any) => void>> = new Map();
  static getInstance() {
    if (!EventBus.instance) EventBus.instance = new EventBus();
    return EventBus.instance;
  }
  on(event: string, handler: (payload: any) => void) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler);
  }
  off(event: string, handler: (payload: any) => void) {
    this.listeners.get(event)?.delete(handler);
  }
  emit(event: string, payload?: any) {
    this.listeners.get(event)?.forEach(h => {
      try { h(payload); } catch (e) { console.error("Bus handler error:", e); }
    });
  }
}
export const bus = EventBus.getInstance();
export function getRuntime() { return { bus }; }
