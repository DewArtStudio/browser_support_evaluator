import URL from "../handlers/url.js";
import Loader from "../handlers/loader.js";

/**
 * Производит парсинг стилей CSS
 * @param {String} styles строка содержащая CSS стили
 * @returns {Array<CSSRule>} возвращает список объектов CSSRule...
 */
export default async function CSSParser(styles, link) {
    console.log(styles);
    // for (let i = 0; i < styles.length; i++) {
    //     if (styles[i].type === "url") {
    //         let styleURL = URL.parse(styles[i].value);
    //         const file = await Loader.get(!styleURL.isAbsolute ? URL.relativeToAbsolute(styleURL, link) : styleURL.url);
    //         if (file.loaded) styles[i].value = file.data;
    //         else {
    //             styles[i].node.parent.children.splice(styles[i].node.parent.children.indexOf(styles[i].node), 1);
    //             styles.splice(i, 1);
    //             i--;
    //         }
    //     }
    // }
    // let res = "";
    // for (let i = 0; i < styles.length; i++) {
    //     const style = styles[i];
    //     let media = style.node.attributes.get("media");
    //     if (media !== undefined) style.value = `@media ${media} {${style.value}}`;
    //     res += style.value;
    // }
    // styles = styles.replace(patterns.hole, "").trim();
    // let errors = [],
    //     nestingLevel = 0;
    // let i = styles.length - 1;
    // let currentLevel = {
    //     parent: undefined,
    //     position: i,
    //     rules: [],
    // };
    // do {
    //     if (styles[i] === "}") {
    //         nestingLevel++;
    //         let newLevel = {
    //             parent: currentLevel,
    //             position: i,
    //             rules: [],
    //             textCSS: "",
    //         };
    //         currentLevel.rules.push(newLevel);
    //         currentLevel = newLevel;
    //     }
    //     if (styles[i] === "{") {
    //         let endPos = i;
    //         while (styles[--i].test(patterns.controlsChars)) {}
    //         let startPos = i;
    //         let declaration = styles.slice(startPos, endPos);

    //         textCSS;

    //         !!nestingLevel ? nestingLevel-- : errors.push("Неизвестный токен");

    //         if (stack.length > 0) {
    //         }
    //     }
    //     if (!nestingLevel && styles[i] === ";") {
    //     }
    // } while (i--);
}
