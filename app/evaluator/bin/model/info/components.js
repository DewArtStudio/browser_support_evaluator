import { createClient } from "redis";
import process from "process";
import asyncModules from "../../controllers/control-data/list-async-modules.js";
import READY_STATUS from "../../enums/ready-status.js";

/**
 * Информация о браузерных компонентах
 */
class ComponentsInfo {
    /**
     * Состояние готовности компонента
     * @type {READY_STATUS}
     */
    isReady;
    /**
     * Информация о HTML компонентах
     * @type {{element: Map.<string, any>, manifest: Map.<string, any>}}
     */
    html = {
        element: new Map(),
        manifest: new Map(),
    };
    /**
     * Информация о CSS компонентах
     * @type {{property: Map.<string, any>, directive: Map.<string, any>, selector: Map.<string, any>, type: Map.<string, any>}}
     */
    css = {
        property: new Map(),
        directive: new Map(),
        selector: new Map(),
        type: new Map(),
    };
    /**
     * Информация о SVG компонентах
     * @type {{element: Map.<string, any>, attribute: Map.<string, any>}}
     */
    svg = {
        element: new Map(),
        attribute: new Map(),
    };
    /**
     * Информация о браузерах
     * @type {Map.<string, any>}}
     */
    browser = new Map();
    /**
     * Иницилализирует объект
     */
    constructor() {
        this.isReady = READY_STATUS.WAITING;
        return;
    }
    static singleton;
    /**
     * Полная инициализация объекта
     * @returns
     * @private
     */
    async _init() {
        /**
         * Инициализирует данные о веб-компонентах
         * @param {string} prefix префикс данных
         * @param {Array<string>} keys ключи данных
         * @param {Object} save объект записи
         * @param {String} saveKey ключ объекта записи
         * @returns {Promise} возвращает статус ошибки, если данные не найдены
         */
        async function initializeComponents(prefix, keys, save, saveKey) {
            let i = keys.length - 1;
            const mapElements = new Map();
            do {
                const key = prefix + keys[i];
                let element = await redis.get(key);
                if (element === null) {
                    console.log(`| Empty anser for ${key} |`);
                    return this.isReady === READY_STATUS.ERROR;
                }
                element = JSON.parse(element);
                mapElements.set(keys[i], element);
            } while (i--);
            save[saveKey] = mapElements;
        }
        /**
         * Инициализирует данные о html-компонентах
         * @param {string} prefix префикс данных
         * @param {Array<string>} keys ключи данных
         * @param {Object} save объект записи
         * @param {String} saveKey ключ объекта записи
         * @returns {Promise} возвращает статус ошибки, если данные не найдены
         */
        async function initializeHtmlElements(prefix, keys, save, saveKey) {
            let i = keys.length - 1;
            const mapElements = new Map();
            do {
                const key = prefix + keys[i];
                let element = await redis.get(key);
                if (element === null) {
                    console.log(`| Empty anser for ${key} |`);
                    return this.isReady === READY_STATUS.ERROR;
                }
                element = JSON.parse(element);
                let j = element.attributes.length - 1;
                const attributesMap = new Map();
                do {
                    const attribute = element.attributes[j];
                    attributesMap.set(attribute.key, attribute.value);
                } while (j--);
                element.attributes = attributesMap;
                mapElements.set(keys[i], element);
            } while (i--);
            save[saveKey] = mapElements;
        }
        const data = {
            htmlElementKeys: await redis.get("#html-element"),
            htmlManifestKeys: await redis.get("#html-manifest"),
            cssPropertyKeys: await redis.get("#css-property"),
            cssDirectiveKeys: await redis.get("#css-directive"),
            cssSelectorKeys: await redis.get("#css-selector"),
            cssTypesKeys: await redis.get("#css-type"),
            svgElementKeys: await redis.get("#svg-element"),
            svgAttributeKeys: await redis.get("#svg-attribute"),
            browsers: await redis.get("#browser"),
        };

        let keys = Object.keys(data);
        let i = keys.length - 1;
        do {
            if (data[keys[i]] === null) {
                console.log(`| Empty anser for ${keys[i]} |`);
                return (this.isReady = READY_STATUS.ERROR);
            } else {
                data[keys[i]] = JSON.parse(data[keys[i]]);
            }
        } while (i--);
        if (!!(await initializeHtmlElements("html-element-", data.htmlElementKeys, this.html, "element"))) return;
        if (!!(await initializeComponents("html-manifest-", data.htmlManifestKeys, this.html, "manifest"))) return;
        if (!!(await initializeComponents("css-property-", data.cssPropertyKeys, this.css, "property"))) return;
        if (!!(await initializeComponents("css-directive-", data.cssDirectiveKeys, this.css, "directive"))) return;
        if (!!(await initializeComponents("css-selector-", data.cssSelectorKeys, this.css, "selector"))) return;
        if (!!(await initializeComponents("css-type-", data.cssTypesKeys, this.css, "type"))) return;
        if (!!(await initializeComponents("svg-element-", data.svgElementKeys, this.svg, "element"))) return;
        if (!!(await initializeComponents("svg-attribute-", data.svgAttributeKeys, this.svg, "attribute"))) return;
        if (!!(await initializeComponents("browser-", data.browsers, this, "browser"))) return;
        this.isReady = READY_STATUS.READY;
    }
}

const component = new ComponentsInfo();
asyncModules.push(component);
const HOST_NAME = process.env.COMPONENT_DB_HOST;
const PASSWORD = process.env.COMPONENT_DB_PASSWORD;
const PORT = process.env.COMPONENT_DB_PORT || 6379;
const redis = createClient({
    url: `redis://default:${PASSWORD}@${HOST_NAME}:${PORT}`,
});
redis.on("error", async () => {
    component.isReady = READY_STATUS.ERROR;
    console.log("| REDIS CONNECT ERROR |");
});
redis.on("ready", async () => {
    await component._init(redis);
});
await redis.connect();

export default component;
