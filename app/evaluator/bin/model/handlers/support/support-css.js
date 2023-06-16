import component from "../../info/components.js";
import CSSATSInterator from "../../parsers/iterators/css-ats-iterator.js";
export default function fillSupportCSS(styles) {
    if (styles !== undefined && styles.stylesheet !== undefined && styles.stylesheet.rules !== undefined) {
        const iterator = new CSSATSInterator(styles.stylesheet);
        while (iterator.hasMore()) {
            let rule = iterator.getNext();
            if (rule.type === "rule" && rule.declarations !== undefined) {
                for (let i = 0; i < rule.declarations.length; i++)
                    setSupport(rule, rule.declarations[i].property, component.css.property);
            } else if (rule.type !== undefined) setSupport(rule, rule.property, component.css.directive);
        }
    }

    return Promise.resolve();
}

function setSupport(rule, name, db) {
    let support = db.get(name);
    if (support !== undefined) {
        rule.support = support;
    }
}
