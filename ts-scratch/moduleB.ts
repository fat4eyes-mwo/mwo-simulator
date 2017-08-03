
import * as ModuleA from "moduleA";

export function bfunc(s: string) : string {
  let ret = "bfunc(" + s + ")";
  console.log(ret);
  return ret;
}

export function getAfromB() : string {
  return ModuleA.getA();
}
