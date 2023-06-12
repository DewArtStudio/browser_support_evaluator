import axios from "axios";
import UserAgent from "user-agents";
/**
 * Класс загрузчика, инкапсулирует проверки связанные с загрузкой документов
 */
export default class Loader {
    /**
     * Получает весь ответ сервера
     * @param {String} url URL ресурса
     */
    static async get(url) {
        const data = { status: -1 };
        try {
            let res = await axios.get(url, {
                headers: {
                    "User-Agent": new UserAgent().toString(),
                },
            });
            data.status = res.status;
            data.data = res.data;
            data.loaded = true;
        } catch (e) {
            
            data.status = 404;
            data.loaded = false;
        }
        return data;
    }

    /**
     * Возвращает тело ответа
     * @param {String} url URL ресурса
     * @param {Function} callback вызывается в случае успешного получения ответа. Принимает параметр res, который является ответом сервера
     * @param {Function} error вызывается в случае ошибки
     */
    static getImage(url, callback, error) {
        axios.get(url).then(callback).catch(error);
    }
    /**
     * Возвращает тело ответа
     * @param {String} url URL ресурса
     * @param {Function} callback вызывается в случае успешного получения ответа. Принимает параметр res, который является ответом сервера
     * @param {Function} error вызывается в случае ошибки
     */
    static getFile(url, callback, error) {
        axios.get(url).then(callback).catch(error);
    }
}
