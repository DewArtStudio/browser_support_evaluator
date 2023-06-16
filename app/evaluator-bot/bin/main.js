import { bot, botDemon } from "./libs/init.js";
import axios from "axios";
import STATUS from "./libs/response-status.js";
export default function main() {
    bot.on("message", async (message) => {
        const text = message.text;
        if (/^\/start/g.test(text)) {
            botDemon.sendMessage(
                message.chat.id,
                "| БОТ ЗАПУЩЕН |\n\nЧтобы получить отчёт о браузерной поддержке страницы Вашего веб-сайта, отправьте боту ссылку на неё"
            );
        } else {
            botDemon.sendMessage(message.chat.id, "Обработка...");
            let response = await axios.post("http://web-server:80/evaluation", { url: text });
            switch (response.data.status) {
                case STATUS.PROCESSED:
                    botDemon.sendMessage(message.chat.id, convertResponse(response.data.data, text));
                    break;
                case STATUS.INCORRECT_URL:
                    botDemon.sendMessage(message.chat.id, "Некорректный URL-адрес!");
                    break;
                case STATUS.UNAVAILABLE:
                    botDemon.sendMessage(message.chat.id, "Сайт недоступен или не существует");
                    break;
                default:
                    botDemon.sendMessage(message.chat.id, "Сервис оценки недоступен");
                    break;
            }
        }
    });
}

function convertResponse(data, url) {
    let res = `| ОТЧЁТ О БРАУЗЕРНОЙ ПОДДЕРЖКЕ |\n\n URL: ${url}\n\n`;
    res += "====================\nНастольные браузеры:\n====================\n\n";
    res += getLine(data, "Google Chrome", "chrome");
    res += getLine(data, "Yandex Browser", "yandex");
    res += getLine(data, "Safari", "safari");
    res += getLine(data, "Mozilla Firefox", "firefox");
    res += getLine(data, "Opera", "opera");
    res += getLine(data, "Microsoft Edge", "edge");
    res += getLine(data, "Internet Explorer", "ie");
    res += getLine(data, "Oculus", "oculus");
    res += "====================\nМобильные браузеры:\n====================\n\n";
    res += getLine(data, "Google Chrome for Android", "chrome_android");
    res += getLine(data, "Yandex Browser for Android", "yandex_android");
    res += getLine(data, "Safari for iOS", "safari_ios");
    res += getLine(data, "Mozilla Firefox for Android", "firefox_android");
    res += getLine(data, "Opera for Android", "opera_android");
    res += getLine(data, "Samsung Internet", "samsunginternet_android");
    res += getLine(data, "WebView", "webview_android");
    return res;
}

function getLine(data, name, key) {
    return `\t${name}:\n\t\tПоддерживается с версии - ${data[key].version};\n\t\tПоследняя версия - ${data[key].latest};\n\n`;
}
