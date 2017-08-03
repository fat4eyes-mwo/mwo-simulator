
export var a : string;

export type TypeA = string;

export function funcA(s : string) : string {
  let ret = "funcA(" + s + ")";
  console.log(ret);
  return ret;
}

export function setA(s: string) {
  a = s;
}

export function getA() : string {
  return a;
}

export const constA = "foo A";
