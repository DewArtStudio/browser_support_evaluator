import STATUS from "../../enums/response-status.js";

function random(min, max) {
    return Math.ceil(Math.random() * (max - min) + min);
}
export default function dataConverter(results) {
    return {
        status: STATUS.PROCESSED,
        data: {
            chrome: {
                status: 0,
                version: "63.0",
                latest: "114.0",
            },
            yandex: {
                status: -1,
                version: "?",
                latest: "23.5.2",
            },
            safari: {
                status: 1,
                version: "-",
                latest: "16.4.1",
            },
            firefox: {
                status: 0,
                version: "71.0",
                latest: "113.0",
            },
            opera: {
                status: 0,
                version: "74.0",
                latest: "99.0",
            },
            ie: {
                status: 1,
                version: "-",
                latest: "11",
            },
            edge: {
                status: 0,
                version: "89.1",
                latest: "114",
            },
            oculus: {
                status: 0,
                version: "11.0",
                latest: "23.0",
            },
            chrome_android: {
                status: 0,
                version: "63.0",
                latest: "114.0",
            },
            yandex_android: {
                status: -1,
                version: "?",
                latest: "23.5.2",
            },
            safari_ios: {
                status: 1,
                version: "-",
                latest: "16.4.1",
            },
            firefox_android: {
                status: 0,
                version: "75.0",
                latest: "113.0",
            },
            opera_android: {
                status: 0,
                version: "80.0",
                latest: "99.0",
            },
            samsunginternet_android: {
                status: 0,
                version: "14.0",
                latest: "21.0",
            },
            webview_android: {
                status: 0,
                version: "64.0",
                latest: "115.0",
            },
        },
    };
}