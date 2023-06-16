export default class CSSATSInterator {
    _root = {};
    _current;
    _status = true;
    constructor(stylesheet) {
        this._root.rules = stylesheet.rules;
        this._current = this._root;
    }

    _stack = [];
    /**
     * @override Возвращает следующий CSSRule
     * @returns {Object}
     */
    getNext() {
        let res = this._current;
        if (this._status) {
            const rules = this._current.rules;
            if (rules !== undefined && rules.length > 0) {
                this._current = rules[0];
                this._stack.push(...rules.slice(1).reverse());
            } else {
                if (this._stack.length === 0) this._status = false;
                else this._current = this._stack.pop();
            }
        }
        return res;
    }
    /**
     * @override
     * @returns {Boolean} true - следующий CSSRule существует, false - конец обхода
     */
    hasMore() {
        return this._status;
    }
}
