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
    /**
     * Производит обход всего дерева
     * @param {Function} handler
     * @param {String} algorithm алгоритм обхода (deep | breadth) (default: 'deep')
     * @param {{value: Boolean}} signal сигнал остановки процесса обхода
     */
    forEach(handler, algorithm = "deep", signal = undefined) {
        this.root.forEach(handler, algorithm, signal);
    }
}
