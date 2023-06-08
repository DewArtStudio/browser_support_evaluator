import NODE_TYPES from "../enums/node-types.js";
import DeepIterator from "./Tree/Iterators/DeepIterator.js";
import BreadthIterator from "./Tree/Iterators/BreadthIterator.js";
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
    attributes = new Map();
    dataAttributes = [];

    _parseNode(node) {
        let keys = Object.keys(node);
        let i = keys.length + 1;
        do {
            let data = node[keys[i]];
            switch (keys[i]) {
                case "tagName":
                    this.tag = getTag(data);
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
                                if (this.class === undefined) this.class = [];
                                this.class.push(...attr.value.split(" "));
                                break;
                            case "style":
                                if (this.inlineStyles === undefined) this.inlineStyles = [];
                                this.inlineStyles.push(getProperties(attr.value));
                                break;
                            default:
                                if (/^data\-/gi.test(attr.name)) {
                                    this.dataAttributes.push(attr);
                                } else {
                                    if (this.attributes === undefined) this.attributes = new Map();
                                    this.attributes.set(attr.name, getAttribute(attr.name, attr.value));
                                }
                                break;
                        }
                    }
                    break;
            }
        } while (i--);
    }
    getDeepIterator() {
        return new DeepIterator(this);
    }
    getBreadthIterator() {
        return new BreadthIterator(this);
    }
}

function getTag(name) {
    return { name: name, support: {} };
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
