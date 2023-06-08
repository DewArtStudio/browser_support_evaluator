import CSSRule from "./CSSRule.js";
class CSSStyleRule extends CSSRule {
    constructor(selectorText, cssText, ruleParent) {
        super(cssText, ruleParent);
        this.selectorText = selectorText;
        let properties = cssText.replace(/(.+?){)gi/gi, "").replace(/}(.+?))gi/gi, "").split(";");
        for (let i = 0; i < properties.length; i++){
            const property = properties[i].split(":")
            styleMap.set(property[0], new CSSPro)
        }
    }
    selectorText;
    style;
    styleMap = new Map();
}
