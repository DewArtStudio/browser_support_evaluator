import ELEMENT_TYPES from "../../../enums/element-types.js";
import component from "../../info/components.js";
import DOM from "../../components/trees/DOM.js";

function attributeHandler(element, info) {
    element.attributes.forEach((e, key) => {
        const attr = info.get(key);
        if (!!attr) {
            e.status = attr.status;
            e.support = attr.support;
        } else {
            if (key === "type" && element.tag.name === "input") {
                let inputAttr = info.get(`${key}_${e.value}`);
                if (!!inputAttr) {
                    e.status = inputAttr.status;
                    e.support = inputAttr.support;
                }
            } else {
                e.status = {};
                e.support = {};
            }
        }
    });
}

function attributeSVGHandler(element, info) {
    element.attributes.forEach((e, key) => {
        const attr = info.get(key);
        if (!!attr) {
            e.status = attr.status;
            e.support = attr.support;
        } else {
            e.status = {};
            e.support = {};
        }
    });
}

/**
 * Производит заполнение узлов DOM дерева информацией о браузерной поддежки HTML-компонентов
 * @param {DOM} dom объект DOM дерева
 */
export default function fillSupportHTML(dom) {
    const htmlElement = component.html.element;
    const svgElement = component.svg.element;

    dom.forEach((element) => {
        if (element.type === ELEMENT_TYPES.TAG) {
            let info = htmlElement.get(element.tag.name);
            if (info !== undefined) {
                element.tag.support = info.support;
                element.tag.status = info.status;
                attributeHandler(element, info.attributes);
            } else {
                info = svgElement.get(element.tag.name);
                if (info !== undefined) {
                    if (element.tag.name === "svg") {
                        if (dom.textSvg === undefined) dom.textSvg = [element];
                        else dom.textSvg.push(element);
                    }
                    element.tag.support = info.support;
                    element.tag.status = info.status;
                    attributeSVGHandler(element, info.attributes);
                } else {
                    if (dom.customTag === undefined) dom.customTag = [element];
                    else dom.customTag.push(element);
                }
            }
        }
    }, "deep");
    return Promise.resolve();
}
