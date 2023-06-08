const patterns = {
    marker: /:\/\//g,
    protocol: /^(.+?):\/\//g,
    domain: /:\/\/(.+?)(\/[^/]+|$)/g,
    path: /[^\/]\/(.+?)(\?|\/$|$)/g,
    httpData: /\?(.+?)$/g,
};
/**
 *
 * @param {String} url
 * @param {String} main
 * @returns {{isParse: Boolean, domain: String, path: String, url: String, get: String}}
 */

export default class URL {
    static parse(req) {
        req = req.replace(/ /g, "").replace(/\/{2,}/gi, "//");
        let isAbsolute,
            protocol,
            domain,
            path,
            url,
            httpData,
            backCount = 0,
            pathSplit = [];

        protocol = (protocol = req.match(patterns.protocol)) !== null ? protocol[0].replace(patterns.marker, "") : "";
        domain = req.replace(/^(.+?)\:\/\//g, "").replace(/\/(.+?)$/g, "");
        path = req.replace(/\?(.+?)$/g, "").replace(/^(.+?)\/\//g, "");

        httpData = (httpData = req.match(patterns.httpData)) !== null ? httpData[0].replace(/^\?/g, "") : "";
        pathSplit = path
            .split("/")
            .slice(domain !== "")
            .filter((a) => a !== "");
        url =
            protocol +
            (protocol === "" ? "" : "://") +
            domain +
            "/" +
            pathSplit.join("/") +
            (httpData !== "" ? "?" : "") +
            httpData;
        isAbsolute = protocol.length > 0 && domain.length > 0;
        if (!isAbsolute)
            while (/^\.\.\//g.test(req)) {
                req = req.replace(/^\.\.\//g, "");
                backCount++;
            }

        return {
            isAbsolute,
            isParse: true,
            protocol,
            domain,
            path,
            url,
            httpData,
            pathSplit,
            backCount,
        };
    }

    static relativeToAbsolute(relativeUrl, currentUrl) {
        if (currentUrl !== undefined) {
            if (!currentUrl.isParse) currentUrl = URL.parse(currentUrl);
        } else throw Error("URL текущей страницы не задан");
        let bias = currentUrl.pathSplit.length - Math.min(currentUrl.pathSplit.length, relativeUrl.backCount);
        return (
            currentUrl.protocol +
            "://" +
            currentUrl.domain +
            currentUrl.pathSplit.slice(0, bias).join("/") +
            relativeUrl.url
        );
    }
}
