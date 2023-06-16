import ORIENTATION from "../enums/orientation.js";
/*
    ПАТТЕРН ДЛЯ ЗАПИСИ
    Ширина экрана при стандартном положении
    Высота экрана при стандартном положении
    Ориентация экрана [стандартное положение, альтернативное]
*/
/**
 * Массив параметров клиентских устройств
 */
const DEVICES_PARAMS = [
    {
        width: 1920,
        height: 1080,
        orientations: [ORIENTATION.LANDSCAPE, ORIENTATION.PORTRAIT],
    },
    // {
    //     width: 2560,
    //     height: 1440,
    //     orientations: [ORIENTATION.LANDSCAPE, ORIENTATION.PORTRAIT],
    // },
    // {
    //     width: 3840,
    //     height: 2160,
    //     orientations: [ORIENTATION.LANDSCAPE, ORIENTATION.PORTRAIT],
    // },
];
export default DEVICES_PARAMS
