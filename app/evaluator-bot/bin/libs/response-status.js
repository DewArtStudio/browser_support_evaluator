let i = 0;
/**
 * Статус загрузки файла
 */
const STATUS = {
    PROCESSED: i++,
    UNAVAILABLE: i++,
    INCORRECT_URL: i++,
};
export default STATUS;
