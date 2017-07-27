"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Greeter {
    constructor(greeting) {
        this.greeting = greeting;
    }
    greet() {
        return "<h1>" + this.greeting + "</h1>";
    }
}
exports.Greeter = Greeter;
;
var greeter = new Greeter("Hello, Dudes of Programming!");
var str = greeter.greet();
console.log(str);
//# sourceMappingURL=hello.js.map