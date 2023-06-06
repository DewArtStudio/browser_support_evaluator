import Iterator from "./Iterator.js";
/**
 * Итератор обхода дерева в ширину
 */
export default class BreadthIterator extends Iterator {
    /**
     * Создаёт объект итератора обхода в ширину
     */
    constructor(node) {
        super(node);
    }
    /**
     * @private cписок, необходимый для обхода дерева
     */
    _list = [];
    /**
     * @override Возвращает следующий узел дерева
     * @returns {Node}
     */
    getNext() {
        let res = this._current;
        if (this._status) {
            const children = this._current.childNodes;
            if (children !== undefined && children.length > 0) {
                this._list.push(...children);
            }
            if (this._list.length > 0) {
                this._current = this._list.shift();
            } else {
                this._status = false;
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

    /**
     * Перемещает указатель корневого узела дерева
     * @param {Node} node 
     */
    setRoot(node) {
        
    }
}
