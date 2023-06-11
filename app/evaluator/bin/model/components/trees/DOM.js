import Tree from "./tree.js";
import Node from "./nodes/node.js";
import HTMLErrors from "../../../enums/errors/HTMLErrors.js";
import NODE_TYPES from "../../../enums/node-types.js";
import component from "../../info/components.js";

/**
 * Представление DOM дерева
 */
export default class DOM extends Tree {
    indexed = [];
    notIndexed = [];
    styles = [];
    scripts = [];
    content = [];
    body;
    head;
    errors = [];
    /**
     * Узлы, которые не влияют на обработку DOM дерева
     */
    _trash = [];
    /**
     * Инициализирует DOM дерево
     * @param {Node} root
     */
    constructor(root) {
        super(root);
    }
}


