
namespace ModelPatterns {
  export interface Pattern {
    id : string;
    name : string;
    pattern : (...params : any[]) => any; //TODO see if a tighter type is possible
    description:  string;
    default : boolean;
  }
}
