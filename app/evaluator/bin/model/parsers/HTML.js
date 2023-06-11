import { parse } from "parse5";
import Node from "../components/trees/nodes/node.js";
/**
 * Производит парсинг HTML документа
 * @param {String} document html-документ
 * @returns {Node} возвращает корень дерева
 */
export default function HTMLParser(document, link) {
    let cur = parse(document);
    let root = new Node(cur);
    root.link = link;
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
    return root;
}
