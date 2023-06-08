import BaseParser from "./Parser.js";

const patterns = {
    hole: /( |\t)/gi,
    controlsChars: /[;@}{]/gi,
};

/**
 * Парсер CSS
 */
class CSS extends BaseParser {
    /**
     * Производит парсинг стилей CSS
     * @param {String} styles строка содержащая CSS стили
     * @returns {Array<CSSRule>} возвращает список объектов CSSRule...
     */
    parse(styles) {
        styles = styles.replace(patterns.hole, "").trim();
        let errors = [],
            nestingLevel = 0;
        let i = styles.length - 1;
        let currentLevel = {
            parent: undefined,
            position: i,
            rules: [],
        };
        do {
            if (styles[i] === "}") {
                nestingLevel++;
                let newLevel = {
                    parent: currentLevel,
                    position: i,
                    rules: [],
                    textCSS: "",
                };
                currentLevel.rules.push(newLevel);
                currentLevel = newLevel;
            }
            if (styles[i] === "{") {
                let endPos = i;
                while (styles[--i].test(patterns.controlsChars)) {}
                let startPos = i;
                let declaration = styles.slice(startPos, endPos);
                
                textCSS;

                !!nestingLevel ? nestingLevel-- : errors.push("Неизвестный токен");

                if (stack.length > 0) {
                }
            }
            if (!nestingLevel && styles[i] === ";") {
            }
        } while (i--);
    }
}


function checkDirective()

const css = new CSS();
css.parse("a {display: none; }  div{background-color:red;}");
export default css;
