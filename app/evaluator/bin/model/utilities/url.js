import Url from "url-parse";
/**
 * Валидатор URL
 */
export default class URL {
    static parse(value) {
        let link = new Url(value);
        if (link.origin === "null") {
            link.protocol = "http";
            link = new Url(link);
        }
        link.correct = link.origin !== "null";
        return link;
    }
    static merge(base, relative) {
        let link = new Url(relative, base);
        link.сorrect = link.origin !== "null";
        return link;
    }
}
