/**
 * Базовый класс для всех итераторов
 */
export default class Iterator {
    constructor(root) {
        this._root = root;
        this._current = root;
        this._status = true;
    }
    /**
     * текущий узел
     */
    _current;
    /**
     * корень дерева
     */
    _root;
    /**
     * cтатус обхода итератора
     */
    _status;
    /**
     * уникальный ключ итератора
     */
    _id;
    /**
     * @virtual Возвращает следующий узел дерева
     * @returns {Node}
     */
    getNext() {
        throw Error("Override this method!");
    }
    /**
     * @virtual
     * @returns {Boolean} true - следующий узел существует, false - конец обхода
     */
    hasMore() {
        throw Error("Override this method!");
    }
    /**
     * @virtual Сбрасывает итератор в изначальное состояние
     */
    reset() {
        this._status = true;
    }
}
