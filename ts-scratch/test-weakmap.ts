
export namespace WeakmapTest {
  export var testWeakmap = function() {
    let weakMap = new WeakMap<any, any>();
    let key1 = "foo";
    weakMap.set(key1, 1);

    //Weakmaps only accept objects as keys. bummer.
    let key2 = "";
    key2 += "foo";
    weakMap.set(key2, 2);

    console.log(`key ${key1} val ${weakMap.get(key1)}`)
    console.log(`key ${key2} val ${weakMap.get(key2)}`)
  }
}