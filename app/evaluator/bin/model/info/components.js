import { createClient } from "redis";
import process from "process";
import READY_STATUS from "../../enums/ready-status.js";
console.log(123);
const components = {
    /**
     * @private
     */
    isReady: READY_STATUS.WAITING,
    getProperty: (key) => undefined,
    getSelector: (key) => undefined,
    getDirective: (key) => undefined,
    getType: (key) => undefined,
    getElement: (key) => undefined,
    getGlobalAttribute: (key) => undefined,
    getManifest: (key) => undefined,
};
// Получение переменных окружения
const HOST_NAME = process.env.CACHE_DB_HOST;
const PASSWORD = process.env.CACHE_DB_PASSWORD;
const PORT = process.env.CACHE_DB_PORT || 6379;
// Подключение к Redis
const redis = createClient({
    url: `redis://default:${PASSWORD}@${HOST_NAME}:${PORT}`,
});
await redis.connect();
redis.on("error", async () => {
    components.isReady = READY_STATUS.ERROR;
    console.log("| REDIS CONNECT ERROR |");
});

async function get(key) {
    const res = await redis.get(key);
    return res !== null ? JSON.parse(res) : undefined;
}

async function getData() {
    const typeKeys = await get("#tech");
}

class Components {
    initialized = false;
    async init() {
        if (typeKeys === undefined) return;
        let i = typeKeys.length - 1;
        do {
            const typeKey = typeKeys[i];
            const type = (this[typeKey.replace(/#/g, "")] = {});
            const categories = await get(typeKey);
            if (categories === undefined) {
                return;
            }
            let j = categories.length - 1;
            do {
                const categoryKey = categories[j];
                type[categoryKey] = new Map();

                const componentKeys = await get(`${typeKey}-${categoryKey}`);
                if (componentKeys === undefined) return;
                let k = componentKeys.length - 1;
                do {
                    const componentKey = `${categoryKey}-${componentKeys[k]}`;

                    const component = await get(componentKey);
                    if (component === undefined) return;
                    type[categoryKey].set(componentKeys[k], component);
                } while (k--);
            } while (j--);
        } while (i--);
        this.initialized = true;
    }
}

const componentsBase = new Components();
await componentsBase.init();
if (components.isReady !== READY_STATUS.ERROR) {
    if (componentsBase.initialized) {
        componentsBuild();
    } else {
        let counter = 0;
        let initInterval = setInterval(async () => {
            if (counter > 30) {
                components.isReady = READY_STATUS.ERROR;
            }
            await componentsBase.init();
            if (componentsBase.initialized) {
                componentsBuild();
                clearInterval(initInterval);
            }
            counter++;
        }, 5000);
    }
}

function componentsBuild() {
    setInterval(() => {
        componentsBase.init();
    }, 43200000);
    components.getProperty = (key) => componentsBase.css.properties.get(key);
    components.getSelector = (key) => componentsBase.css.selectors.get(key);
    components.getDirective = (key) => componentsBase.css["at-rules"].get(key);
    components.getType = (key) => componentsBase.css.types.get(key);
    components.getElement = (key) => componentsBase.html.elements.get(key);
    components.getGlobalAttribute = (key) => componentsBase.html.global_attributes.get(key);
    components.getManifest = (key) => componentsBase.html.manifest.get(key);
    components.isReady = READY_STATUS.READY;
}

export default components;
