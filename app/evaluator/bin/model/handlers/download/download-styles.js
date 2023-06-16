import css from "css";
import URL from "../../utilities/url.js";
import Loader from "../../utilities/loader.js";
import HTML_ERRORS from "../../../enums/html-errors.js";
export default async function downloadStyles(dom, baseUrl) {
    //Загрузка всех стилей
    for (let i = 0; i < dom.styles.length; i++) {
        const style = dom.styles[i];
        if (style.type === "link") {
            let url = URL.merge(baseUrl, style.value);
            let res = await Loader.get(url.href);
            if (res.loaded) {
                style.type = "text";
                style.value = res.data;
                while (/@import/g.test(style.value)) {
                    style.value = await replaceAsync(style.value, /@import(.+?);/g, async (imprt) => {
                        let tmp = imprt.replace(/(.+?)\(/g, "").replace(/\)(.+?)$/g, "");
                        let url = URL.merge(baseUrl, tmp);
                        let res = await Loader.get(url.href);
                        if (res.loaded) return res.data;
                        else dom.errors.push(HTML_ERRORS.MESSAGE(`Неудалось загрузить файл стилей. URL${url.href}`));
                        return "";
                    });
                }
                if (style.media !== undefined && style.media.trim() !== "") {
                    style.namespace = style.value.match(/@namespace(.+?);/g);
                    style.charset = style.value.match(/@charset(.+?);/g);
                    style.value = style.value.replace(/@namespace(.+?);/g, "");
                    style.value = style.value.replace(/@charset(.+?);/g, "");
                }
            } else {
                dom.errors.push(HTML_ERRORS.MESSAGE_SELECTOR(style.element, "Неудалось загрузить файлы стилей"));
                style.element.parent.children.splice(style.parent.children.indexOf(style));
                dom.styles.splice(i);
                i--;
            }
        }
    }
    // for (let i = 0; i < dom.styles.length; i++) {
    //     const style = dom.styles[i];
    //     if (style.media !== undefined && style.media.trim() !== "")
    //         style.value = `@media ${style.media} {${style.namespace === undefined ? "" : style.namespace.join(" ")}${
    //             style.charset === undefined ? "" : style.charset.join(" ")
    //         }${style.value}}`;
    // }
    return Promise.resolve(dom.styles);
}

async function replaceAsync(string, regexp, replacerFunction) {
    const replacements = await Promise.all(Array.from(string.matchAll(regexp), (match) => replacerFunction(...match)));
    let i = 0;
    return string.replace(regexp, () => replacements[i++]);
}
