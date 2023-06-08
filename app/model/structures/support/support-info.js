/**
 * Информация о поддержке
 */
export default class SupportInfo {
    /**
     * Версия браузера, с которой начинается поддержка сущности
     * @type {Array<Number>}
     */
    start;
    /**
     * Список проблем с реализацией сущности в определенных версиях браузера
     * @type {Array<String>}
     */
    problems;
    /**
     * Список альтернатив сущности
     * @type {Array<String>}
     */
    alternatives;

    /**
     * Создает объект
     * @param {Array<Number>} start версия браузера с которой начинается поддержка
     * @param {Array<String>} problems проблемы сущности в определенных версиях браузера
     * @param {Array<String>} alternatives альтернативы реализации сущности
     */
    constructor(value) {
        this.start = value.start;
        this.problems = value.problems;
        this.alternatives = value.start;
    }
}
