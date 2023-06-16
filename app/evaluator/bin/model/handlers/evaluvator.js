import ELEMENT_TYPES from "../../enums/element-types.js";
/**
 * Оценивает браузерную поддержку веб-страницы
 */
export default function evaluator(render) {
    const res = getSupportObject();
    const resHTML = getSupportObject();
    const resAttr = getSupportObject();
    const resCSS = getSupportObject();

    render.dom.forEach((element) => {
        if (element.type === ELEMENT_TYPES.TAG) {
            checkSupport(element.tag, resHTML);

            element.attributes.forEach((e) => {
                checkSupport(e, resAttr);
            });
        }
    });
    render.cssom.forEach((element) => {
        if (element.support !== undefined) {
            checkSupport(element.support, resCSS);
        }
    });
    let all = merge(resHTML, resAttr, resCSS);
    return Promise.resolve({ all: all, html: resHTML, attr: resAttr, css: resCSS });
}

function getSupportObject() {
    return {
        webview_android: 1,
        samsunginternet_android: 1,
        safari_ios: 1,
        safari: 1,
        opera_android: 1,
        opera: 1,
        oculus: 1,
        nodejs: 1,
        ie: 1,
        firefox_android: 1,
        firefox: 1,
        edge: 1,
        deno: 1,
        chrome_android: 1,
        chrome: 1,
    };
}

function checkSupport(element, res) {
    if (element.support !== undefined) {
        let keys = Object.keys(element.support);
        let i = keys.length - 1;
        if (i < 0) return;
        do {
            const key = keys[i];
            if (isNaN(res[key])) continue;
            const supportUnit = element.support[key];
            if (supportUnit !== undefined) {
                if (supportUnit.version_added !== undefined) {
                    res[key] = getMaxVersion([res[key], supportUnit.version_added]);
                } else {
                    let len = element.support[key].length;
                    if (len !== undefined) {
                        let versionAdded = [];
                        for (let j = 0; j < len; j++) {
                            try {
                                if (element.support[key][j].version_added !== undefined)
                                    versionAdded.push(element.support[key][j].version_added);
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        if (versionAdded.length > 0) res[key] = getMaxVersion([res[key], ...versionAdded]);
                        else res[key] = NaN;
                    } else res[key] = NaN;
                }
            }
        } while (i--);
    }
}

function getMaxVersion(versions) {
    let correctVersions = [];
    let i = versions.length - 1;
    let max = 0;
    let maxMajor = [];
    do {
        let tmp = versions[i];
        if (isNaN(tmp)) return NaN;

        if (tmp !== null && tmp !== undefined) {
            if (typeof tmp !== "number")
                if (typeof tmp === "string") tmp = tmp.replace(/[^0-9\.]/g, "");
                else if (typeof tmp === "boolean") tmp = 1;
                else if (tmp === undefined) tmp = 1;

            correctVersions.push(tmp.toString().split("."));
        }
    } while (i--);
    i = correctVersions.length - 1;
    do {
        const version = correctVersions[i];
        let major = Number.parseFloat(version[0]);
        if (major > max) {
            max = major;
            maxMajor = [version];
        } else if (major === max) maxMajor.push(version);
    } while (i--);
    if (maxMajor.length > 1) {
        let max = { pos: 0, value: 0 };
        for (let i = 0; i < maxMajor.length; i++) {
            let tmp = Number.parseInt(maxMajor[i].slice(1).join("."));
            if (tmp > max.value) {
                max.value = tmp;
                max.pos = i;
            }
        }
        maxMajor[0] = maxMajor[max.pos];
    }
    return maxMajor[0].join(".");
}
const browserKeys = [
    "chrome",
    "safari",
    "firefox",
    "opera",
    "ie",
    "edge",
    "oculus",
    "chrome_android",
    "safari_ios",
    "firefox_android",
    "opera_android",
    "samsunginternet_android",
    "webview_android",
];
function merge(html, attr, css) {
    let res = getSupportObject();
    try {
        for (let i = 0; i < browserKeys.length; i++) {
            res[browserKeys[i]] = getMaxVersion([html[browserKeys[i]], attr[browserKeys[i]], css[browserKeys[i]]]);
        }
    } catch (e) {
        return {
            webview_android: "*",
            samsunginternet_android: "*",
            safari_ios: "*",
            safari: "*",
            opera_android: "*",
            opera: "*",
            oculus: "*",
            nodejs: "*",
            ie: "*",
            firefox_android: "*",
            firefox: "*",
            edge: "*",
            deno: "*",
            chrome_android: "*",
            chrome: "*",
        };
    }

    return res;
}
