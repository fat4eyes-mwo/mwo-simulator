import {MechDataQuirkData} from "./data/mechdata-quirks";

export interface StringIndexed {
  [index:string] : any;
}
export interface NumberIndexed {
  [index:number] : any;
}
export class Quirk {
  name : string;
  value : number;
  translated_name : string;
  constructor(name : string, value : number) {
    this.name = name;
    this.value = Number(value);
    this.translated_name = this.translateName();
  }
  translateName() {
    let nameEntry = MechDataQuirkData.QuirkTranslatedNameMap[this.name];
    if (nameEntry) {
      return nameEntry.translated_name;
    } else {
      return this.name;
    }
  }
  toString() {
    return `{name: "${this.name}", value: "${this.value}"}`;
  }
}
