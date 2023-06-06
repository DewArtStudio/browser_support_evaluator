import Iterator from "./Iterator.js";
/**
 * Итератор обхода дерева в глубину
 */
export default class DeepIterator extends Iterator {
    /**
     * Создаёт объект итератора обхода в глубину
     */
    constructor(root) {
        super(root);
    }
    /**
     * @private cтек, необходимый для обхода дерева
     */
    _stack = [];
    /**
     * @override Возвращает следующий узел дерева
     * @returns {Node}
     */
    getNext() {
        let res = this._current;
        if (this._status) {
            const children = this._current.children;
            if (children !== undefined && children.length > 0) {
                this._current = children[0];
                this._stack.push(...children.slice(1).reverse());
            } else {
                if (this._stack.length === 0) this._status = false;
                else this._current = this._stack.pop();
            }
        }
        return res;
    }
    /**
     * @override
     * @returns {Boolean} true - следующий узел существует, false - конец обхода
     */
    hasMore() {
        return this._status;
    }
}
