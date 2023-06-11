import fs from "fs";
import { createClient } from "redis";
import process from "process";

const HOST_NAME = process.env.COMPONENT_DB_HOST;
const PASSWORD = process.env.COMPONENT_DB_PASSWORD;
const PORT = process.env.COMPONENT_DB_PORT || 6379;
const redis = createClient({
    url: `redis://default:${PASSWORD}@${HOST_NAME}:${PORT}`,
});
const compat = "__compat";
await redis.connect();
redis.on("error", async () => {
    console.log("| REDIS CONNECT ERROR |");
});
const TECH_KEYS = {
    HTML: "#html",
    CSS: "#css",
    SVG: "#svg",
};
export default async function main() {
    console.log("| REDIS CONNECTED |");

    const support = JSON.parse(fs.readFileSync("/app/browser-compat-data/build/data.json").toString());
    const cssData = JSON.parse(fs.readFileSync("/app/data/css/properties.json").toString());
    
    // ==============
    // HTML
    // ==============
    const html = extractHTML(support.html); // {elements, manifest}
    await writeSupport("html", "element", html.elements);
    await writeSupport("html", "manifest", html.manifest);
    await redis.set("#html", JSON.stringify(["element", "manifest"]));

    // ==============
    // CSS
    // ==============
    const css = extractCSS(support.css); // {properties, directives, selectors, types}
    await writeSupport("css", "property", mergeCSS(css.properties, extractCSSData(cssData)));
    await writeSupport("css", "directive", css.directives);
    await writeSupport("css", "selector", css.selectors);
    await writeSupport("css", "type", css.types);
    await redis.set("#css", JSON.stringify(["property", "directive", "selector", "type"]));

    // ==============
    // SVG
    // ==============
    const svg = extractSVG(support.svg); // {elements, attributes}
    writeSupport("svg", "element", svg.elements);
    writeSupport("svg", "attribute", svg.attributes);
    await redis.set("#svg", JSON.stringify(["element", "attribute"]));

    // ==============
    // BROWSERS
    // ==============
    const browsers = extractBrowsers(support.browsers);
    writeSupport("browser", "", browsers);

    // ==============
    // INFO
    // ==============
    await redis.set("#tech", JSON.stringify(["html", "css", "svg"]));

    console.log("| DATA ENTERED |");
}

function extractCSSData(data) {
    const res = new Map();
    const propertyKeys = Object.keys(data);
    let i = propertyKeys.length - 1;
    do {
        const key = propertyKeys[i];
        const property = data[key];
        if (typeof property.initial === "string") property.initial = [property.initial];
        res.set(key, { inherited: property.inherited, status: property.status });
    } while (i--);
    return res;
}

function extractHTML(html) {
    function extractElements(elements, global) {
        const tags = [];
        const elementKeys = Object.keys(elements);
        let i = elementKeys.length - 1;
        do {
            const elementKey = elementKeys[i];
            const element = elements[elementKey];
            const tag = {
                key: elementKey,
                value: {
                    attributes: [...global],
                },
            };
            const keys = Object.keys(element);
            let j = keys.length - 1;
            do {
                const key = keys[j];
                if (key === compat) {
                    tag.value.support = element[key].support;
                    tag.value.status = element[key].status;
                } else {
                    const attribute = element[key][compat];
                    tag.value.attributes.push({
                        key: key,
                        value: { status: attribute.status, support: attribute.support },
                    });
                }
            } while (j--);
            tags.push(tag);
        } while (i--);
        return tags;
    }
    function extractGlobalAttributes(attributes) {
        const res = [];
        const keys = Object.keys(attributes);
        let i = keys.length - 1;
        do {
            const key = keys[i];
            const attribute = attributes[key][compat];
            res.push({ key: key, value: { status: attribute.status, support: attribute.support } });
        } while (i--);
        return res;
    }
    function extractManifest(manifest) {
        const keys = Object.keys(manifest);
        const res = [];
        let i = keys.length - 1;
        do {
            const key = keys[i];
            const unit = manifest[key][compat];
            res.push({ key: key, value: { status: unit.status, support: unit.support } });
        } while (i--);
        return res;
    }
    const global = extractGlobalAttributes(html.global_attributes);

    const elements = extractElements(html.elements, global);
    const manifest = extractManifest(html.manifest);
    return { elements, manifest };
}

function extractCSS(css) {
    function extractComponent(components) {
        const componentKeys = Object.keys(components);
        let i = componentKeys.length - 1;
        const res = [];
        do {
            const component = components[componentKeys[i]][compat];
            res.push({ key: componentKeys[i], value: { status: component.status, support: component.support } });
        } while (i--);
        return res;
    }
    return {
        properties: extractComponent(css["properties"]),
        directives: extractComponent(css["at-rules"]),
        selectors: extractComponent(css["selectors"]),
        types: extractComponent(css["types"]),
    };
}

function extractSVG(svg) {
    function extractElements(elements) {
        const res = [];
        const elementKeys = Object.keys(elements);
        let i = elementKeys.length - 1;
        do {
            const elementKey = elementKeys[i];
            const element = { key: elementKey, value: { attributes: [] } };
            const elementData = elements[elementKey];
            const keys = Object.keys(elementData);
            let j = keys.length - 1;
            do {
                const key = keys[j];
                if (key === compat) {
                    element.value.status = elementData[key].status;
                    element.value.support = elementData[key].status;
                } else {
                    const attribute = elementData[key];
                    element.value.attributes.push({ status: attribute.status, support: attribute.support });
                }
            } while (j--);
            res.push(element);
        } while (i--);
        return res;
    }
    function extractAttributes(attributes) {
        const res = [];
        const categoryKeys = Object.keys(attributes);
        let i = categoryKeys.length - 1;
        do {
            const categoryKey = categoryKeys[i];
            const category = attributes[categoryKey];
            const data = category[compat];
            if (category[compat] !== undefined) {
                res.push({ key: categoryKey, value: { status: data.status, support: data.support } });
            } else {
                const attributeKeys = Object.keys(category);
                let j = attributeKeys.length - 1;
                do {
                    const attributeKey = attributeKeys[j];
                    const attribute = category[attributeKey];
                    if (attribute[compat] !== undefined) {
                        res.push({
                            key: attributeKey,
                            value: { status: attribute.status, support: attribute.support },
                        });
                    } else {
                        const keys = Object.keys(attribute);
                        let k = keys.length - 1;
                        do {
                            const key = keys[k];
                            const attr = attribute[key][compat];
                            res.push({ key: key, value: { status: attr.status, support: attr.support } });
                        } while (k--);
                    }
                } while (j--);
            }
        } while (i--);
        return res;
    }

    const elements = extractElements(svg.elements);
    const attributes = extractAttributes(svg.attributes);
    return {
        elements,
        attributes,
    };
}

async function writeSupport(tech, category, components) {
    const prefix = `${tech}${category !== "" ? "-" : ""}${category}`;

    let i = components.length - 1;
    const keys = [];
    do {
        const component = components[i];
        const key = `${prefix}-${component.key}`;
        keys.push(component.key);
        await redis.set(key, JSON.stringify(component.value));
    } while (i--);
    await redis.set(`#${prefix}`, JSON.stringify(keys));
}

function extractBrowsers(data) {
    const res = [];
    const browserKeys = Object.keys(data);
    for (let i = 0; i < browserKeys.length; i++) {
        res.push({ key: browserKeys[i], value: data[browserKeys[i]] });
    }
    return res;
}

function mergeCSS(properties, data) {
    let i = properties.length - 1;
    do {
        const property = properties[i];
        let propertyData = data.get(property.key);
        if (propertyData === undefined) {
            propertyData = { status: "nonstandard", inherited: false };
        }
        property.value.inherited = propertyData.inherited;
        property.value.status.standart = propertyData.status;
    } while (i--);
    return properties;
}
