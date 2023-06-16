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
    try {
        url = URL.parse(url); // Парсинг URL с целью определения его корректности
        if (url.correct) {
            // Если URL корректен выполнить
            let res = await Loader.get(url.href); // Ожидание загрузки веб-страницы
            if (res.status === 200) {
                // Статус ответа сервера 200 (страница загружена)
                const document = res.data; // HTML-документ
                const HTMLObjectModel = HTMLParser(document, url); // Объектное представление HTML
                const dom = new DOM(HTMLObjectModel); // Построение DOM
                let asyncData = await Promise.allSettled([
                    // "Асинхронное" выполнение (модули загрузки ожидают получение данных)
                    fillSupportHTML(dom), // В каждый узел DOM дерева присваивается информация о поддержке всех компонентов
                    downloadStyles(dom, url).then(
                        (
                            styles // Загрузка всех файлов стилей
                        ) =>
                            CSSParser(styles).then(
                                (
                                    CSSObjectModel // Объектное представление CSS
                                ) =>
                                    Promise.allSettled([
                                        Promise.resolve(new CSSOM(dom, CSSObjectModel)), // Построение CSSOM
                                        fillSupportCSS(CSSObjectModel), // В каждый объект CSSRule заносится информация о поддержке
                                    ])
                            )
                    ),
                    downloadScripts(dom, url), // Загрузка всех файлов скриптов
                ]);
                const cssom = asyncData[1]["value"][0]["value"]; // Получение данных из промиса
                const renderTreeHandlers = []; // Массив обработчиков
                for (
                    let i = 0;
                    i < DEVICES_PARAMS.length;
                    i++ // DEVICE_PARAMS - массив объектов с данными об устройствах
                )
                    renderTreeHandlers.push(
                        // Построение render дерева при определенных параметрах клиентских устройств
                        Promise.resolve(new Render(dom, cssom, DEVICES_PARAMS[i])).then((render) => evaluator(render))
                    ); // evaluator - функция, которая обходит render tree и определяет проблемы поддержки
                const evaluateData = await Promise.allSettled(renderTreeHandlers); // Результат работы функций evaluator
                return dataConverter(evaluateData[0]["value"]); // Преобразование данных для отправки на сервер
            } else return { status: STATUS.UNAVAILABLE }; // Сайт недоступен
        } else return { status: STATUS.INCORRECT_URL }; // Некорректный URL
    } catch (e) {
        console.log(e);
        return { status: STATUS.UNAVAILABLE };
    }
}
