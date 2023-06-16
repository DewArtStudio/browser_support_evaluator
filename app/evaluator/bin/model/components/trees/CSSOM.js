import Tree from "./tree.js";
import CSSATSInterator from "../../parsers/iterators/css-ats-iterator.js";
/**
 * Представление CSSOM дерева
 */
export default class CSSOM extends Tree {
    objectModel;
    constructor(dom, objectModel) {
        super(dom);
        this.objectModel = objectModel;
        const iterator = new CSSATSInterator(objectModel.stylesheet);
        while (iterator.hasMore()) {
            let rule = iterator.getNext();
        }
    }

    forEach(handler, algorithm = "deep", signal = undefined) {
        const iterator = new CSSATSInterator(this.objectModel.stylesheet);
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
}
