// Загрузка файлов
import Loader from "../utilities/loader.js";
import URL from "../utilities/url.js";
// Парсеры
import HTMLParser from "../parsers/HTML.js";
import CSSParser from "../parsers/CSS.js";
// Классы деревьев
import DOM from "../components/trees/DOM.js";
import CSSOM from "../components/trees/CSSOM.js";
import Render from "../components/trees/render.js";
// Обработчики деревьев
import fillSupportHTML from "../handlers/support/support-html.js";
import fillSupportCSS from "../handlers/support/support-css.js";
import downloadStyles from "../handlers/download/download-styles.js";
import downloadScripts from "../handlers/download/download-scripts.js";
import evaluator from "../handlers/evaluvator.js";
// Перечисления
import DEVICES_PARAMS from "../../data/devices-params.js";
import STATUS from "../../enums/response-status.js";
import SELECTOR_TYPES from "../../enums/selector-types.js";
// Преобразователи данных
import dataConverter from "../handlers/data-converter.js";

/**
 * Производит обработку запроса на оценку браузерной поддержки
 * @param {String} url ссылка на страницу веб-сайта
 */
export default async function evaluateSupport(url) {
    url = URL.parse(url);
    if (url.correct) {
        let res = await Loader.get(url.href);
        if (res.status === 200) {
            const document = res.data;
            const HTMLObjectModel = HTMLParser(document, url);
            const dom = new DOM(HTMLObjectModel);
            let asyncData = await Promise.allSettled([
                fillSupportHTML(dom),
                downloadStyles(dom, url).then((styles) =>
                    CSSParser(styles).then((CSSObjectModel) =>
                        Promise.allSettled([
                            Promise.resolve(new CSSOM(dom, CSSObjectModel)),
                            fillSupportCSS(CSSObjectModel),
                        ])
                    )
                ),
                downloadScripts(dom, url),
            ]);
            const cssom = asyncData[1]["value"][0]["value"];
            const renderTreeHandlers = [];
            for (let i = 0; i < DEVICES_PARAMS.length; i++)
                renderTreeHandlers.push(
                    Promise.resolve(new Render(dom, cssom, DEVICES_PARAMS[i])).then((render) => evaluator(render))
                );

            let result = await Promise.allSettled(renderTreeHandlers);
            return dataConverter(result) ;
        } else {
            return { status: STATUS.UNAVAILABLE };
        }
    } else {
        return { status: STATUS.INCORRECT_URL };
    }
}
