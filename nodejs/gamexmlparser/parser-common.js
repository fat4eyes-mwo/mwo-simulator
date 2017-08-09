"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mechdata_quirks_1 = require("./data/mechdata-quirks");
class Quirk {
    constructor(name, value) {
        this.name = name;
        this.value = Number(value);
        this.translated_name = this.translateName();
    }
    translateName() {
        let nameEntry = mechdata_quirks_1.MechDataQuirkData.QuirkTranslatedNameMap[this.name];
        if (nameEntry) {
            return nameEntry.translated_name;
        }
        else {
            return this.name;
        }
    }
    toString() {
        return `{name: "${this.name}", value: "${this.value}"}`;
    }
}
exports.Quirk = Quirk;
//# sourceMappingURL=parser-common.js.map