class StylePropertyMap {
    _map = new Map();
    set(property, value) {
        this._map.set(property, value);
    }
    append(property, value) {
        let updateValue = this._map.get(property)
        updateValue = tmp === undefined ? value : 
        this._map.set(property, value);
    }
    delete(property) {
        this._map.delete(property);
    }
    clear() {
        delete this._map;
        this._map = new Map();
    }
}
