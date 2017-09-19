export namespace TestEnum {
  enum Names {
    FIRST = "First",
    LAST = "Last"
  }

  //weird case, they transpile enums into namespace-like objects, so you can add more entries to the enum later
  //in a completely different location like so. Not sure if a bug or feature, 
  //it's too intentional to be an accident of implementation
  enum Names {
    MIDDLE= "Middle",
  }

  enum Flavors {
    Up = "Up",
    Down = "Down",
  }

  export var testEnum = function() {
    let name : Names;
    let flavor : Flavors;

    name = Names.FIRST;
    
    console.log(`${name} ${name.toString()}`);

    name = Names.MIDDLE;

    console.log(`${name} ${name.toString()}`);
  }
}