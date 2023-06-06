const patterns = {
    marker: /:\/\//g,
    protocol: /^(.+?):\/\//g,
    domain: /:\/\/(.+?)(\/|$)/g,
    path: /\/(.+?)\?/g,
    get: /\?(.+?)$/g,
};
/**
 *
 * @param {String} url
 * @param {String} main
 * @returns {{isParse: Boolean, domain: String, path: String, url: String, get: String}}
 */
export default function parseURL(url, main) {
    if (main !== undefined) {
        if (!main.isParse) {
            main = parseURL(main);
        }
    }
    let isCorrect = true,
        protocol = null,
        domain = null,
        path = null,
        getValues = null;
    try {
        protocol = url.match(patterns.protocol);
        protocol = protocol === null ? main.protocol : protocol[0].replace("://", "");
        domain = url.match(patterns.domain);
        domain = domain === null ? main.domain : domain[0].replace(/[:/]/g, "");
        path = url.replace(protocol, "").replace(patterns.marker, "").replace(domain, "").match(patterns.path);
        path = path === null ? "" : path[0].replace(/\?/g, "");
        getValues = url.match(patterns.get);
        getValues = getValues === null ? "" : getValues[0];
    } catch (e) {
        isCorrect = false;
    }
    return isCorrect
        ? {
              isParse: true,
              protocol: protocol,
              domain: domain,
              path: protocol + "://" + domain + path,
              url: protocol + "://" + domain + path + getValues,
              get: getValues,
          }
        : false;
}
