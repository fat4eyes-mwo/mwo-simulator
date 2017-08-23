
namespace MWOSimEvents {
  export type EventType = string;
  export interface Event {
    type : EventType;
  }
  export type EventListener = (event : Event) => void;
  
  class ListenerEntry {
    private eventTypes : Set<EventType>;
    private listener : EventListener;

    constructor(listener: EventListener, types : EventType[]) {
      this.listener = listener;
      this.eventTypes = new Set(types);
    }

    isListening(type : EventType) : boolean {
      return this.eventTypes.has(type);
    }

    getListener() : EventListener {
      return this.listener;
    }

    getEventTypes() : Set<EventType> {
      return this.eventTypes;
    }
    addEventTypes(types : EventType[]) {
      for (let type of types) {
        this.eventTypes.add(type);
      }
    }
  }

  export class EventQueue {
    private static instance : EventQueue;

    private queue : Event[];
    private stepScheduled : boolean;
    private listeners : Map<EventType, Set<EventListener>>;
    private listenerMap : Map<EventListener, ListenerEntry>;

    constructor() {
      this.queue = [];
      this.stepScheduled = false;
      this.listeners = new Map();
      this.listenerMap = new Map();
    }

    private getListeners(event: EventType) : Set<EventListener> {
      let ret = this.listeners.get(event);
      if (!ret) {
        ret = new Set();
        this.listeners.set(event, ret);
      }
      return ret;
    }
    public addListener(listener : EventListener, ...eventTypes : EventType[]) {
      let listenerEntry = this.listenerMap.get(listener);
      if (!listenerEntry) {
        listenerEntry = new ListenerEntry(listener, eventTypes);
        this.listenerMap.set(listener, listenerEntry);
      }
      listenerEntry.addEventTypes(eventTypes);
      for (let type of listenerEntry.getEventTypes()) {
        let listenerSet = this.getListeners(type);
        listenerSet.add(listenerEntry.getListener());
      }
    }
    //if no event types given, will unregister listener to all events
    public removeListener(listener : EventListener, ...eventTypes : EventType[]) {
      let listenerEntry = this.listenerMap.get(listener);
      if (!listenerEntry) {
        throw Error("Listener not registered");
      }
      let eventTypesToRemove : Iterable<EventType>;
      if (!eventTypes || eventTypes.length === 0) {
        eventTypesToRemove = listenerEntry.getEventTypes();
      } else {
        eventTypesToRemove = eventTypes;
      }
      for (let eventType of eventTypesToRemove) {
        let listenerSet = this.listeners.get(eventType);
        listenerSet.delete(listener);
        listenerEntry.getEventTypes().delete(eventType);
      }
      //all entries removed
      if (listenerEntry.getEventTypes().size === 0) {
        this.listenerMap.delete(listener);
      }
    }

    public debugString() : string {
      let logger = new Util.StringLogger();
      logger.log("Listeners");
      for (let listener of this.listenerMap.keys()) {
        let logStr = listener.name;
        
        logStr += " [";
        let listenerEntry = this.listenerMap.get(listener);
        listenerEntry.getEventTypes().forEach((type) => {
          logStr += type + " ";
        });
        logStr += "]";
        logger.log(logStr);
      }
      logger.log("Event->Listener map");
      for (let eventType of this.listeners.keys()) {
        let logStr = eventType;
        logStr += " [";
        for (let listener of this.listeners.get(eventType)) {
          logStr += listener.name + " ";
        }
        logStr += "]";
        logger.log(logStr);
      }
      return logger.getLog();
    }

    public queueEvent(event : Event) {

    }

    private step() {
      //TODO: Execute observers


      this.stepScheduled = false;
    }
  }
}