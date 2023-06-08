import SupportInfo from "./support-info.js";
/**
 * Базовый класс поддержки.
 *
 * Объект класса не знает к какой сущности он принадлежит. Он хранит исключительно информацию о поддержке во всех браузерах.
 */
export default class Support {
    /**
     * Информация о поддержке в браузере Google Chrome.
     * @type {Support}
     */
    chrome;
    /**
     * Информация о поддержке в браузере Microsoft Edge.
     * @type {Support}
     */
    edge;
    /**
     * Информация о поддержке в браузере Apple Safari for Mac.
     * @type {Support}
     */
    safari;
    /**
     * Информация о поддержке в браузере Firefox.
     * @type {Support}
     */
    firefox;
    /**
     * Информация о поддержке в браузере Opera.
     * @type {Support}
     */
    opera;
    /**
     * Информация о поддержке в браузере Internet Explorer.
     * @type {Support}
     */
    IE;
    /**
     * Информация о поддержке в браузере Google Chrome for Andorid.
     * @type {Support}
     */
    chromeAndroid;
    /**
     * Информация о поддержке в браузере Apple Safari for iOS.
     * @type {Support}
     */
    safariIOS;
    /**
     * Информация о поддержке в браузере Samsung Browser.
     * @type {Support}
     */
    samsungBrowser;
    /**
     * Информация о поддержке в браузере Opera Mini.
     * @type {Support}
     */
    operaMini;
    /**
     * Информация о поддержке в браузере Opera Mobile.
     * @type {Support}
     */
    OperaMobile;
    /**
     * Информация о поддержке в браузере UCBrowser.
     * @type {Support}
     */
    UCBrowser;
    /**
     * Информация о поддержке в браузере Android Browser.
     * @type {Support}
     */
    androidBrowser;
    /**
     * Информация о поддержке в браузере Firefox for Android.
     * @type {Support}
     */
    firefoxAndroid;
    /**
     * Информация о поддержке в браузере QQBrowser.
     * @type {Support}
     */
    QQBrowser;
    /**
     * Информация о поддержке в браузере BaiduBrowser.
     * @type {Support}
     */
    BaiduBrowser;
    /**
     * Информация о поддержке в браузере KaiOSBrowser.
     * @type {Support}
     */
    KaiOSBrowser;
    /**
     * Создает объект с информацией о поддержки определенной сущности в различных браузерах.
     * @param {String} support принимается JSON с информацией о поддержке определенной сущности.
     */
    constructor(support) {
        let keys = Object.keys(this);
        let i = keys.length - 1;
        do {
            const key = keys[i],
                value = support[key];
            value !== undefined && (this[key] = new SupportInfo(value));
        } while (i--);
    }
}
