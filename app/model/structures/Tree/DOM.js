import Tree from "./Tree.js";
import Node from "../Node.js";
import HTMLErrors from "../../errors/HTMLErrors.js";
import NODE_TYPES from "../../enums/node-types.js";
/**
 * Представление DOM дерева
 */
export default class DOM extends Tree {
    nodeCounter = 0;
    indexed = [];
    notIndexed = [];
    styles = [];
    scripts = [];
    content = [];
    body;
    head;
    errors = [];
    /**
     * Инициализирует DOM дерево
     * @param {Node} root
     */
    constructor(root) {
        super(root);
        let iterator = root.getDeepIterator();
        while (iterator.hasMore()) {
            let node = iterator.getNext();
            if (node.type !== NODE_TYPES.TEXT) this.nodeCounter++;
            if (node.tag !== undefined) {
                switch (node.tag.name) {
                    case "head":
                        if (this.head === undefined) this.head = node;
                        else this.errors.push(HTMLErrors.MULTIPLE_HEAD);
                        break;

                    case "body":
                        if (this.body === undefined) this.body = node;
                        else this.errors.push(HTMLErrors.MULTIPLE_BODY);
                        break;

                    case "noindex":
                        if (!node.doNotIndex) {
                            let i = node.getBreadthIterator();
                            while (i.hasMore()) {
                                i.getNext().doNotIndex = true;
                            }
                        }
                        break;

                    case "a":
                        let href = node.attributes.get("href");
                        if (href !== undefined) {
                            if (href.value === "") {
                                this.errors.push(HTMLErrors.MISSING_LINK(node));
                            } else {
                                if (node.doNotIndex) {
                                    this.notIndexed.push(href.value);
                                } else {
                                    this.indexed.push(href.value);
                                }
                            }
                        }
                        break;

                    case "link":
                        if (node.attributes !== undefined) {
                            let attr = node.attributes.get("href");
                            if (attr !== "" || attr !== undefined) {
                                this.styles.push({ type: "url", value: attr });
                            } else {
                                this.errors.push(HTMLErrors.MISSING_STYLE(node));
                            }
                        }

                        break;

                    case "style":
                        if (node.children.length === 1) {
                            this.styles.push({ type: "text", value: node.children[0].text });
                        } else {
                            this.errors.push(HTMLErrors.STYLE_SYNTAX_ERROR);
                        }
                        break;

                    case "script":
                        this.scripts.push(node);
                        break;
                    //Добавить информацию, которую необходимо хранить
                }
            }
        }
    }
    getStyles() {
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
