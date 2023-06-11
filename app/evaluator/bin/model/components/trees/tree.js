import Node from "./nodes/node.js";
/**
 * Базовый класс дерева
 */
export default class Tree {
    /**
     * Инициализирует объект дерева
     * @param {Node} root
     */
    constructor(root) {
        this.root = root;
        this.path = root.link.path;
    }
    /**
     * @type {Node} Корень дерева
     * @private
     */
    root;
    /**
     * Возвращает указатель на корень дерева
     * @returns {Node} корень дерева
     */
    getRoot() {
        return this.root;
    }
    getDeepIterator() {
        return this.root.getDeepIterator();
    }

    getBreadthIterator() {
        return this.root.getBreadthIterator();
    }
}
