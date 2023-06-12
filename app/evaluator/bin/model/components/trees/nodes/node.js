import DeepIterator from "../iterators/DeepIterator.js";
import BreadthIterator from "../iterators/BreadthIterator.js";
import ELEMENT_TYPES from "../../../../enums/element-types.js";
/**
 * Узел DOM дерева
 */
export default class Node {
    tag = {};
    attributes = new Map();
    dataAttributes = new Map();
    /**
     * Создаёт узел DOM дерева
     * @param {Object} type
     */
    constructor(node) {
        switch (node.nodeName) {
            case "#text":
                this.type = ELEMENT_TYPES.TEXT;
                this.value = node.value;
                break;
            case "#comment":
                this.type = ELEMENT_TYPES.COMMENT;
                this.value = node.data;
                break;
            case "#document":
                this.type = ELEMENT_TYPES.DOCUMENT;
                this.mode = node.mode;
                break;
            case "#documentType":
                this.type = ELEMENT_TYPES.DOCTYPE;
                this.doctype = node.name;
                break;
            default:
                this.type = ELEMENT_TYPES.TAG;
                this.tag.name = node.tagName;
                if (node.attrs !== undefined) {
                    node.attrs.forEach((e) => {
                        if (/^data/gi.test(e.name)) {
                            this.dataAttributes.set(e.name, { value: e.value });
                        } else {
                            this.attributes.set(e.name, { value: e.value });
                        }
                    });
                }
                break;
        }

        if (node.pseudoNode === undefined) node.pseudoNode = this;
        if (node.parentNode !== undefined) {
            this.parent = node.parentNode.pseudoNode;
            if (node.parentNode.pseudoNode.children === undefined) node.parentNode.pseudoNode.children = [];
            node.parentNode.pseudoNode.children.push(this);
        }
    }
    /**
     * Производит обход всего поддерева
     * @param {Function} handler
     * @param {String} algorithm алгоритм обхода (deep | breadth) (default: 'deep')
     * @param {{value: Boolean}} signal сигнал остановки процесса обхода
     */
    forEach(handler, algorithm = "deep", signal = undefined) {
        let iterator;
        if (algorithm === "deep") iterator = new DeepIterator(this);
        else if (algorithm === "breadth") iterator = new BreadthIterator(this);
        else throw new Error("Указан неверный алгоритм обхода");
        if (signal !== undefined)
            while (iterator.hasMore() && signal.value) {
                handler(iterator.getNext());
            }
        else {
            while (iterator.hasMore()) {
                handler(iterator.getNext());
            }
        }
    }



    clone() {
        
    }
}
