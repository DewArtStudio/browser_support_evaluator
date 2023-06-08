import STATUS from "../enums/response-status.js";
import Loader from "../handlers/loader.js";
import { parse } from "parse5";
import DOM from "../structures/Tree/DOM.js";
import Node from "../structures/Node.js";
import NODE_TYPES from "../enums/node-types.js";
import DATA_TYPES from "../enums/data-types.js";
import URL from "../handlers/url.js";
import css from "css";
import fs from "fs";
/**
 * Производит обработку запроса на оценку браузерной поддержки
 * @param {String} url ссылка на страницу веб-сайта
 */
export default async function browserEvaluator(link) {
    link = URL.parse(link);
    if (link.isAbsolute) {
        let res = await Loader.get(link.url);
        if (res.status === 200) {
            let dom = DOMBuilder(res.data);
            await extractCSS(dom.getStyles(), link);
            return { status: STATUS.PROCESSED };
        } else {
            return { status: STATUS.INCORRECT_URL };
        }
    } else {
        console.log("Некорректный url");
    }
}



function parseHTML(document) {
    let cur = parse(document);
    let root = new Node(cur);
    let stack = [];
    stack.push(...cur.childNodes.slice(1).reverse());
    cur = cur.childNodes[0];
    while (true) {
        new Node(cur);
        const children = cur.childNodes;
        if (children !== undefined && children.length > 0) {
            cur = children[0];
            stack.push(...children.slice(1).reverse());
        } else {
            if (!!stack.length) cur = stack.pop();
            else break;
        }
    }
    return new DOM(root);
}

async function extractCSS(styles, link) {
    for (let i = 0; i < styles.length; i++) {
        if (styles[i].type === "url") {
            let styleURL = URL.parse(styles[i].value);
            const file = await Loader.get(!styleURL.isAbsolute ? URL.relativeToAbsolute(styleURL, link) : styleURL.url);
            if (file.loaded) styles[i].value = file.data;
            else {
                styles[i].node.parent.children.splice(styles[i].node.parent.children.indexOf(styles[i].node), 1);
                styles[i].splice(i, 1);
                i--;
            }
        }
    }
    let res = "";
    for (let i = 0; i < styles.length; i++) {
        const style = styles[i];
        let media = style.node.attributes.get("media");
        if (media !== undefined) style.value = `@media ${media} {${style.value}}`;
        res += style.value;
    }

    fs.writeFileSync("text.css", res);
    console.log(css.parse(res, { silent: true }).stylesheet.rules);
}
