import CSSRule from "./CSSRule.js";
import cssData from "../../data/CSSData.js";

const emptyProperty = {
    name: "#",
    inherits: false,
    syntax: undefined,
    support: undefined,
};

/**
 * Класс CSS свойства
 */
class CSSPropertyRule extends CSSRule {
    /**
     * Создаёт объект CSS свойства
     * @param {CSSRule} parentRule родительский объект CSSRule
     * @param {String} name название свойства
     * @param {String} initalValue значение свойства
     */
    constructor(parentRule, name, initalValue) {
        super(parentRule, name, value);
        let data = cssData.get(name);
        if (data === undefined) data = emptyProperty;
        this.name = name;
        this.inherits = data.inherits;
        this.initalValue = initalValue;
        this.syntax = data.syntax;
        this.support = data.support;
    }

    /**
     * Флаг наследования (true - свойство наследуется, false - свойство не наследуется)
     */
    inherits;
    /**
     * Значение свойства
     */
    initalValue;
    /**
     * Название свойства
     */
    name;
    /**
     * Синтаксис свойства
     */
    syntax;
    /**
     * Браузерная поддержка свойства
     */
    support;
}
