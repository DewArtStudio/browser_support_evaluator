import DeepIterator from "./Iterators/DeepIterator.js";
import BreadthIterator from "./Iterators/BreadthIterator.js";
/**
 * Базовый класс дерева
 */
export default class Tree {
    /**
     * Инициализирует объект дерева
     * @param {Node} root
     */
    constructor(root) {
        this._root = root;
    }
    /**
     * @type {Node} Корень дерева
     * @private
     */
    _root;
    /**
     * Возвращает указатель на корень дерева
     * @returns {Node} корень дерева
     */
    getRoot() {
        return this._root;
    }
    getDeepIterator(node = this._root) {
        return new DeepIterator(node);
    }

    getBreadthIterator(node = this._root) {
        return new BreadthIterator(node);
    }
}
