import css from "css";

/**
 * Производит парсинг стилей CSS
 * @param {String} styles строка содержащая CSS стили
 * @returns {Array<CSSRule>} возвращает список объектов CSSRule...
 */
export default async function CSSParser(styles) {
    let cssText = "";
    let numberStyles = styles.length;
    if (styles !== undefined && numberStyles > 0) {
        for (let i = 0; i < numberStyles; i++) {
            const style = styles[i];
            if (style.type === "text") cssText += style.value;
            else throw new Error("Не все стили загружены");
        }
        
    }
    return Promise.resolve(css.parse(cssText.replace(/\/\*(.*?)\*\//gs, ""), { silent: true }));
}
