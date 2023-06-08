import CSSRule from "./CSSRule.js";
/**
 * Интерфейс объектной модели CSS, для вложенных правил
 */
export default class CSSGroupingRule extends CSSRule {
    constructor(cssText, ruleParent, parentStyleSheet) {
        super(cssText, ruleParent, parentStyleSheet);
    }
    cssRules;
    insertRule() {}
    deleteRule() {}
}
