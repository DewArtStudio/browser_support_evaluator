import Url from "url-parse";
/**
 * Валидатор URL
 */
export default class URL {
    static parse(value) {
        let link = new Url(value);
        console.log(link);
        if (link.origin === "null" && link.protocol === "") {
            link.protocol = "http";
            link = new Url(link);
        }

        link.correct = link.origin !== "null";
        console.log(link);
        return link;
    }
    static merge(base, relative) {
        let link = new Url(relative, base);
        link.сorrect = link.origin !== "null";
        return link;
    }
}
