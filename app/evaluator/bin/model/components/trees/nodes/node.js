import NODE_TYPES from "../../../../enums/node-types.js";
import DeepIterator from "../iterators/DeepIterator.js";
import BreadthIterator from "../iterators/BreadthIterator.js";
/**
 * Узел DOM дерева
 */
export default class Node {
    /**
     * Создаёт узел DOM дерева
     * @param {NODE_TYPES} type
     * @param {*} data
     * @param {*} node
     */
    constructor(node) {
        switch (node.nodeName) {
            case "#text":
                this.type = NODE_TYPES.TEXT;
                this.text = node.value;
                break;
            case "#document":
                this.type = NODE_TYPES.DOCUMENT;
                break;
            case "#documentType":
                this.type = NODE_TYPES.DOCTYPE;
                break;
            case "#comment":
                return;
            default:
                this.type = NODE_TYPES.NODE;
                break;
        }
        this._parseNode(node);
        if (node.pseudoNode === undefined) node.pseudoNode = this;

        if (node.parentNode !== undefined) {
            this.parent = node.parentNode.pseudoNode;
            if (node.parentNode.pseudoNode.children === undefined) node.parentNode.pseudoNode.children = [];
            node.parentNode.pseudoNode.children.push(this);
        }
    }

    /**
     * @type {NODE_TYPES}
     */
    type;
    styles = [];
    inlineStyles = [];
    class = [];
    attributes = new Map();
    dataAttributes = [];

    _parseNode(node) {
        let keys = Object.keys(node);
        let i = keys.length + 1;
        do {
            let data = node[keys[i]];
            switch (keys[i]) {
                case "tagName":
                    this.tag = { name: data };
                    break;
                case "nodeName":
                    this.node = data;
                    break;
                case "attrs":
                    let len = data.length;
                    for (let j = 0; j < len; j++) {
                        let attr = data[j];
                        switch (attr.name) {
                            case "id":
                                this.id = attr.value;
                                break;
                            case "class":
                                this.class.push(...attr.value.split(" "));
                                break;
                            case "style":
                                this.inlineStyles.push(getProperties(attr.value));
                                break;
                            default:
                                if (/^data\-/gi.test(attr.name)) {
                                    this.dataAttributes.push(attr);
                                } else {
                                    this.attributes.set(attr.name, getAttribute(attr.name, attr.value));
                                }
                                break;
                        }
                    }
                    break;
            }
        } while (i--);
    }
    /**
     * Возвращает итератор в глубину по поддереву текущего узла
     * @returns {DeepIterator}
     */
    getDeepIterator() {
        return new DeepIterator(this);
    }
    /**
     * Возвращает итератор в ширину по поддереву текущего узла
     * @returns {BreadthIterator}
     */
    getBreadthIterator() {
        return new BreadthIterator(this);
    }
}

function getAttribute(name, value) {
    return { name, value, support: {} };
}
function getProperties(style) {
    let properties = style.split(";");
    let res = new Map();
    for (let i = 0; i < properties.length; i++) {
        let data = properties[i].split(":");
        res.set(data[0], {});
    }
    return res;
}
