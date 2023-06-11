// Загрузка файлов
import Loader from "../handlers/loader.js";
import URL from "../handlers/url.js";
// Классы деревьев
import DOM from "../components/trees/DOM.js";
import CSSOM from "../components/trees/CSSOM.js";
import Render from "../components/trees/render.js";
// Парсеры
import HTMLParser from "../parsers/HTML.js";
import CSSParser from "../parsers/CSS.js";
// Перечисления
import DEVICES_PARAMS from "../data/devices-params.js";
import STATUS from "../../enums/response-status.js";

/**
 * Производит обработку запроса на оценку браузерной поддержки
 * @param {String} link ссылка на страницу веб-сайта
 */
export default async function evaluateSupport(link, response) {
    // link = URL.parse(link);
    // if (link.isAbsolute) {
    //     let res = await Loader.get(link.url);
    //     if (res.status === 200) {
    //         const document = res.data;
    //         const HTMLObjectModel = HTMLParser(document, link);
    //         const dom = new DOM(HTMLObjectModel);
    //         dom.init();
    //         const styles = dom.getStyles();
    //         const CSSObjectModel = CSSParser(styles, link);
    //         const cssom = new CSSOM(CSSObjectModel);
    //         for (let i = 0; i < DEVICES_PARAMS.length; i++) {
    //             const render = new Render(dom, cssom, DEVICES_PARAMS[i]);
    //         }
    //         return { status: STATUS.PROCESSED };
    //     } else {
    //         return { status: STATUS.INCORRECT_URL };
    //     }
    // } else {
    //     console.log("Некорректный url");
    // }
}
