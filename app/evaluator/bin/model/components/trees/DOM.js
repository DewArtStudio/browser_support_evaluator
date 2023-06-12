import Tree from "./tree.js";
import Node from "./nodes/node.js";
import HTML_ERRORS from "../../../enums/errors.js";
import ELEMENT_TYPES from "../../../enums/element-types.js";
import component from "../../info/components.js";
import SELECTOR_TYPES from "../../../enums/selector-types.js";
/**
 * Представление DOM дерева
 */
export default class DOM extends Tree {
    /**
     * Индексируемые ссылки
     * @type {Array<String>}
     */
    indexed = [];
    /**
     * Неиндексируемые всеми поисковыми роботами ссылки
     * @type {Array<String>}
     */
    notIndexedAll = [];
    /**
     * Неиндексируемые поисковыми роботами Google ссылки
     * @type {Array<String>}
     */
    notIndexedGoogle = [];
    /**
     * Неиндексируемые поисковыми роботами Yandex ссылки
     * @type {Array<String>}
     */
    notIndexedYandex = [];
    /**
     * Узлы стилей
     * @type {Array<{type: string, value: string}>}
     */
    styles = [];
    /**
     * Узлы скриптов
     * @type {Array<String>}
     */
    scripts = [];
    /**
     * Узлы контента
     * @type {Array<String>}
     */
    content = [];
    /**
     * Весь текст страницы
     */
    text = [];
    /**
     * Тело страницы
     * @type {Node}
     */
    body;
    /**
     * Голова страницы
     * @type {Node}
     */
    head;
    /**
     * Тег html страницы
     * @type {Node}
     */
    html;
    /**
     * Тип разметки
     * @type {String}
     */
    doctype;
    /**
     * Корневой тег HTML
     * @type {Node}
     */
    document;
    /**
     * Ошибки страницы
     * @type {Array<String>}
     */
    title = [];
    /**
     * Описание страницы
     * @type {Array<string>}
     */
    description = [];
    /**
     * Ключевые слова
     * @type {Array<string>}
     */
    keywords = [];
    /**
     * Значение viewport
     * @type {Array<string>}
     */
    viewport = [];
    /**
     * Метатеги страницы
     * @type {Array<Node>}
     */
    meta = [];
    /**
     * Кодировка страницы
     * @type {Array<string>}
     */
    charset = [];
    /**
     * Ошибки
     * @type {Array<string>}
     */
    errors = [];
    /**
     * Узлы, которые не влияют на обработку DOM дерева
     * @type {Array<Node>}
     */
    _trash = [];
    /**
     * Файл(ы) манифеста
     * @type {Array<Node>}
     */
    manifest = [];

    tagMap = new Map();
    attributeMap = new Map();
    classMap = new Map();
    idMap = new Map();
    /**
     * Инициализирует DOM дерево
     * @param {Node} root
     */
    constructor(root) {
        super(root);
        // Получение основных тегов страницы
        const signal = { value: true };
        root.forEach(
            (element) => {
                if (element.type === ELEMENT_TYPES.TAG) {
                    if (element.tag.name === "body") this.body = element;
                    if (element.tag.name === "head") this.head = element;
                    if (element.tag.name === "html") this.html = element;
                }
                if (element.type === ELEMENT_TYPES.DOCTYPE) this.doctype = element.doctype;
                if (element.type === ELEMENT_TYPES.DOCUMENT) this.document = element;
                signal.value = !this.body || !this.head || !this.html || !this.doctype || !this.document;
            },
            "breadth",
            signal
        );
        signal;
        //Обход головы страницы
        this.head !== undefined &&
            this.head.forEach((element) => {
                // Сбор манифеста

                if (element.type === ELEMENT_TYPES.TAG) {
                    if (element.tag.name === "title") {
                        element.children.forEach((e) => {
                            this.title.push(e.value);
                        });
                    }
                    let rel = element.attributes.get("rel");
                    if (element.tag.name === "link" && !!rel && rel.value === "manifest") {
                        let href = element.attributes.get("href");
                        if (href !== undefined && href.value !== "") this.manifest.push(href.value);
                        else this.errors.push(HTML_ERRORS.MESSAGE_SELECTOR(element, "Отсутствует ссылка на манифест"));
                    }
                    if (element.tag.name === "meta") {
                        this.meta.push(element);
                        const metaAttribute = ["description", "keywords", "viewport"];
                        let attr = element.attributes.get("name");
                        if (attr !== undefined) {
                            let i = metaAttribute.indexOf(attr.value);
                            if (i !== -1) {
                                const content = element.attributes.get("content");
                                if (content === undefined) this.errors.push(HTML_ERRORS.MESSAGE_SELECTOR(element));
                                else this[metaAttribute[i]].push(content.value);
                            }
                        }
                        attr = element.attributes.get("charset");
                        if (attr !== undefined) this.charset = attr.value;
                    }
                }
            }, "deep");

        // Обход тела
        this.body !== undefined &&
            this.body.forEach((element) => {
                // СБОР ТЕКСТА
                if (element.type === ELEMENT_TYPES.TEXT) {
                    let text = element.value.trim().replace(/[\x00-\x1F\x7F]/g, "");
                    if (text !== "") this.text.push(text);
                }
                // СБОР КОНТЕНТА
                let src = element.attributes.get("src");
                if (src !== undefined) {
                    src.value = src.value.trim().replace(/[\x00-\x1F\x7F]/g, "");
                    if (src.value !== "") {
                        if (element.tag.name !== "script") this.content.push({ node: element, src: src.value });
                    } else this.errors.push(HTML_ERRORS.MESSAGE_SELECTOR(element, "Пустой атрибут src"));
                }
                // СБОР ССЫЛОК
                if (element.tag.name === "noindex") {
                    element.forEach((e) => {
                        e.noindex = true;
                    });
                }

                if (element.tag.name === "a") {
                    let href = element.attributes.get("href");
                    if (href !== undefined) {
                        let rel = element.attributes.get("rel");
                        let noreferrer =
                            !!element.attributes.get("noreferrer") || (!!rel && rel.value.includes("noreferrer"));
                        if (element.noindex && noreferrer) {
                            this.notIndexedAll.push(href.value);
                        } else if (element.noindex) this.notIndexedYandex.push(href.value);
                        else if (noreferrer) this.notIndexedGoogle.push(href.value);
                        else this.indexed.push(href.value);
                    } else
                        this.errors.push(
                            HTML_ERRORS.MESSAGE_SELECTOR(element, "В теге <a></a> отсутствует атрибут href")
                        );
                }
            }, "deep");

        function selectorAgregate(key, element, map) {
            let data = map.get(key);
            if (data === undefined) data = [];
            data.push(element);
            map.set(key, data);
        }
        // Обход всего дерева
        this.forEach((element) => {
            if (element.type === ELEMENT_TYPES.TAG) {
                selectorAgregate(element.tag.name, element, this.tagMap);
                let tmp = element.attributes.get("class");
                if (!!tmp) {
                    element.class = tmp.value.split(" ");
                    element.class.forEach((e) => {
                        selectorAgregate(e, element, this.classMap);
                    });
                }
                tmp = element.attributes.get("id");
                if (!!tmp) {
                    element.id = tmp.value;
                    selectorAgregate(element.id, element, this.idMap);
                }

                if (element.tag.name === "style") {
                    // СБОР СТИЛЕЙ
                    const unitStyle = [];
                    if (element.children !== undefined) {
                        element.children.forEach((e) => {
                            e.value !== undefined && unitStyle.push(e.value);
                        });
                        if (unitStyle.length > 0) this.styles.push({ type: "text", value: unitStyle.join(" ") });
                        else this.errors.push(HTML_ERRORS.MESSAGE_SELECTOR(element, "Пустой тег style"));
                    } else this.errors.push(HTML_ERRORS.MESSAGE_SELECTOR(element, "Пустой тег style"));
                }
                let rel = element.attributes.get("rel");
                if (element.tag.name === "link" && !!rel && rel.value === "stylesheet") {
                    const href = element.attributes.get("href");
                    if (href !== undefined) this.styles.push({ type: "link", value: href.value });
                    else this.errors.push(HTML_ERRORS.MESSAGE_SELECTOR(element, "Отсутствует атрибут href"));
                }
                // СБОР СКРИПТОВ
                if (element.tag.name === "script") {
                    const src = element.attributes.get("src");
                    if (src !== undefined) {
                        this.scripts.push({ type: "link", value: src.value });
                    } else {
                        if (element.children !== undefined) {
                            const unitScript = [];
                            element.children.forEach((e) => {
                                e.value !== undefined && unitScript.push(e.value);
                            });
                            if (unitScript.length > 0) this.scripts.push({ type: "text", value: unitScript.join(" ") });
                            else this.errors.push(HTML_ERRORS.MESSAGE_SELECTOR(element, "Пустой тег script"));
                        } else this.errors.push(HTML_ERRORS.MESSAGE_SELECTOR(element, "Пустой тег script"));
                    }
                }
            }
            // СБОР МУСОРА
            if (element.type === ELEMENT_TYPES.TEXT) {
                if (
                    element.parent.type === ELEMENT_TYPES.TAG &&
                    element.parent.tag.name !== "style" &&
                    element.parent.tag.name !== "script"
                ) {
                    this._trash.push(element);
                }
            }
            if (element.type === ELEMENT_TYPES.COMMENT) this._trash.push(element);
        }, "deep");
        const manifest = this.html.attributes.get("manifest");
        if (!!manifest) this.manifest.push(manifest);
    }

    querySelector(selector) {
        let selectorLen = selector.length;
        let main
        switch (selector[0].type) {
            case SELECTOR_TYPES.TAG:
                main = this.tagMap.get(selector[0].value);
                break;
            case SELECTOR_TYPES.ID:
                main = this.idMap.get(selector[0].value);
                break;
            case SELECTOR_TYPES.CLASS:
                main = this.classMap.get(selector[0].value);
                break;
            case SELECTOR_TYPES.ATTRIBUTE:
                main = this.attributeMap.get(selector[0].value);
                break;
        }
        if (main === undefined) return undefined; // ВЫХОД, ЕСЛИ ГЛАВНОГО СЕЛЕКТОРА НЕ НАЙДЕНО
        for (let i = 1; i < selectorLen; i++) {
            let selectorUnit = selector[i];
            let mainLen = main.length;
            for (let i = 0; i < mainLen; i++) {
                let item = selector[i];
            }
        }
        
    }
}
