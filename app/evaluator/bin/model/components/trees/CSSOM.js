import Tree from "./tree.js";
/**
 * Представление CSSOM дерева
 */
export default class CSSOM extends Tree {
    constructor(dom, styles) {
        super(dom);
    }
}
