import Tree from "./tree.js";
import Node from "./nodes/node.js";
import HTMLErrors from "../../../enums/errors/HTMLErrors.js";
import NODE_TYPES from "../../../enums/node-types.js";
import component from "../../info/components.js";


const tags = []

/**
 * Представление DOM дерева
 */
export default class DOM extends Tree {
    indexed = [];
    notIndexed = [];
    srcStyles = [];
    scripts = [];
    content = [];
    body;
    head;
    errors = [];
    /**
     * Узлы, которые не влияют на обработку DOM дерева
     */
    _trash = [];
    /**
     * Инициализирует DOM дерево
     * @param {Node} root
     */
    constructor(root) {
        super(root);
    }
    async init() {
        let iterator = this.root.getDeepIterator();
        while (iterator.hasMore()) {
            let node = iterator.getNext();
            switch (node.node) {
                case "#comment":
                    this.trash.push(node);
                    break;
                case "#document":
                    break;
                case "#documentType":
                    break;
                case "#text":
                    break;
                default:
                    if (node.tag !== undefined) {
                        initTag(node);
                    } else {
                        console.log("НЕОБРАБОТАННЫЙ ТИП УЗЛА", node);
                    }
            }
        }
    }
    removeTrash() {
        let i = this.trash.length;
        do {
            this.trash[i].parent.children.splice(indexOf(this.trash[i]));
            delete this.trash[i];
        } while (i--);
        this.trash = null;
    }
    /**
     *
     * @param {Boolean} reExtract [true - обойти DOM дерево еще раз с целью получить стили, false - извлечь уже обработанные стили]
     * @returns
     */
    getStyles(reExtract = false) {
        if (reExtract) {
            const iterator = this.root.getBreadthIterator();
            while (iterator.hasMore()) {
                const node = iterator.getNext();
            }
        } else {
        }
        //if (this.styles) console.log(this.srcStyles);
        return this.styles;
    }
    getScripts() {
        return this.scripts;
    }
    getErrors() {
        return this.errors;
    }
    getInfo() {
        return {
            nodeCount: this.nodeCounter,
            linksCount: this.indexed.length + this.notIndexed.length,
            allLinks: [...this.indexed, ...this.notIndexed],
            indexedLinks: this.indexed,
            notIndexedLinks: this.notIndexed,
        };
    }
}

function initTag(node) {
    node.tag.support = support.getElement(node.tag.name);
    if (node.tag.support === undefined) console.log(node.tag.name);
}

function extractStyles() {}
