import CSSRule from "./CSSRule.js";
/**
 * Упорядоченная коллекция объектов CSSRule
 */
export default class CSSRuleList extends Array {
    constructor(cssText, ruleParent, parentStyleSheet) {
        super(cssText, ruleParent, parentStyleSheet);
    }
    /**
     * Количество элементов в списке
     */
    cssRules;
    insertRule() {}
    deleteRule() {}
}

let a = new CSSRuleList();
a.push("123");
a.push("123");
console.log(a);
