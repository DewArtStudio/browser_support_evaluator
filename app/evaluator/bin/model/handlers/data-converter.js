import STATUS from "../../enums/response-status.js";
import component from "../info/components.js";
const keys = [
    "chrome",
    "yandex",
    "safari",
    "firefox",
    "opera",
    "ie",
    "edge",
    "oculus",
    "chrome_android",
    "yandex_android",
    "safari_ios",
    "firefox_android",
    "opera_android",
    "samsunginternet_android",
    "webview_android",
];
export default function dataConverter(data) {
    const all = convertTechData(data.all);
    const html = convertTechData(data.html);
    const attr = convertTechData(data.attr);
    const css = convertTechData(data.css);

    return {
        status: STATUS.PROCESSED,
        data: all,
        dataHTML: html,
        dataAttr: attr,
        dataCSS: css,
    };
}

function convertTechData(data) {
    let res = {};
    let i = keys.length - 1;
    do {
        const key = keys[i];
        let version = data[key];
        version = isNaN(version) ? "-" : version;
        if (data[key] === undefined) {
            res[key] = {
                status: 0,
                version: `?`,
                latest: `23`,
            };
        } else {
            res[key] = {
                status: 0,
                version: version,
                latest: component.browser.get(key).latest,
            };
        }
    } while (i--);
    return res;
}
