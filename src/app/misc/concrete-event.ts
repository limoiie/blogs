export interface ConcreteEvent<T extends EventTarget> extends Event {
  target: T
}
