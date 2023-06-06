import STATUS from "../enums/response-status.js";
import Loader from "../handlers/loader.js";
import { parse } from "parse5";
import DOM from "../structures/Tree/DOM.js";
import Node from "../structures/Node.js";
import NODE_TYPES from "../enums/node-types.js";
import parseURL from "../handlers/urlParser.js";
/**
 * Производит обработку запроса на оценку браузерной поддержки
 * @param {String} url ссылка на страницу веб-сайта
 */
export default async function browserEvaluator(url) {
    url = parseURL(url);
    let res = await Loader.get(url.url);
    if (res.status === 200) {
        let dom = DOMBuilder(res.data);
        let stylesData = dom.getStyles();
        let styles = [];
        for (let i = 0; i < stylesData.length; i++) {
            if (stylesData[i].type === "url") styles.push(extractCSS(stylesData[i].value, url));
            else styles.push(stylesData[i].value);
        }
        let scripts = Loader.get(dom.getStyles());
        // while (iterator.hasMore()) {
        //     let cur = iterator.getNext();
        //     console.log(cur);
        // }
        return { status: STATUS.PROCESSED };
    } else {
        return { status: STATUS.INCORRECT_URL };
    }
}

function DOMBuilder(document) {
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

function extractCSS(url, base) {
    let styles = parseURL(url.value, base);
    console.log(styles.url);
    Loader.get(styles);
}
