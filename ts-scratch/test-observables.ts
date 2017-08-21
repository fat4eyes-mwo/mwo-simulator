import * as Rx from "../node_modules/rxjs/Rx";

export namespace TestObservables {

  let functionObserver = function(observer : Rx.Observer<number>) {
    setTimeout(() => {
      observer.next(2);
      observer.next(4);
      observer.complete();
      
    }, 1000);
  }

  var eventQueue: number[];
  var initEventQueue = function () {
    const INIT_MAX = 10000;
    eventQueue = new Array<number>(INIT_MAX);
    for (let i = 0; i < INIT_MAX; i++) {
      eventQueue[i] = i;
    }
  }

  export var testObservables = function () {
    //TODO: The way you import Rxjs is wrong somehow, it puts the contents of the module in
    //Rx.default instead of Rx itself. Compiling this produces an error but the generated code
    //actually works
    let observable = Rx.default.Observable;
    initEventQueue();

    for (let OBSERVERS = 1; OBSERVERS <=20; OBSERVERS++) {
      let timerName = `Rx_${OBSERVERS}x_observer`;
      console.time(timerName);
      let eventQueueObservable = observable.from(eventQueue)
        .map(function (x: number) { return x; });
      
      //NOTE: All subscribed functions WILL NOT BE GARBAGE COLLECTED until they unsubscribe
      //It may be a better choice to use a standard event queue with a weakmap to observers
      //so you don't have to do explicit unsubscribes when a UI component is deleted.
      for (let ctr = 0; ctr < OBSERVERS; ctr++) {
        eventQueueObservable
        .subscribe(function (x: number) {
          let y= x * ctr;
          return y;
          // console.log(`Observer#${ctr} : ${y}`);
        });
      }
      console.timeEnd(timerName);
    }
  }
}