
namespace ModuleA {
  export function funcA(s : string) : string {
    let ret = "funcA(" + s + ")";
    console.log(ret);
    return ret;
  }
  export const constA = "foo A";
}
