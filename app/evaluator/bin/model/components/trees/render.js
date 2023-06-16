import Tree from "./tree.js";
/**
 * Представление рендер дерева
 */
export default class Render extends Tree {
    /**
     * Производит слияние DOM и CSSOM деревьев при определенных параметрах
     * @param {DOM} dom объект DOM дерева
     * @param {CSSOM} cssom объект CSSOM дерева
     */
    dom;
    cssom;
    param;
    constructor(dom, cssom, param) {
        super(dom);
        this.dom = dom;
        this.cssom = cssom;
        this.param = param;

        dom.forEach((element) => {
            let a = 2 + 2;
        });
    }
}
