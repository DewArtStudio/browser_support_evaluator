import fs from "fs";
import path from "path";
import Support from "../structures/support/support.js";
/**
 * Класс
 */
class CSSData {
    /**
     * Список ключ-значения синтаксиса
     */
    _propertiesMap = new Map();
    _supportMap = new Map();

    constructor(properties, support) {
        let i = syntax.length - 1;
        do {
            this._propertiesMap.set(syntax[i].name, syntax[i].value);
        } while (i--);
        i = support.length - 1;
        do {
            this._supportMap.set(support[i].name, new Support(support[i].value));
        } while (i--);
    }
    /**
     * Возвращает информацию о CSS свойстве
     * @param {String} name
     * @param {String} value
     * @returns {inherits: Boolean, syntax: String, support: Support}
     */
    get(name, value) {
        let property = this.syntaxMap.get(name);
        return { inherits: false, syntax: "<property>", support: true };
    }
}



const cssData = new CSSData(propertyData, supportData);
export default cssData;
