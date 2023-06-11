import READY_STATUS from "../enums/ready-status.js";
import asyncModules from "./control-data/list-async-modules.js";
/**
 * Выполняет callback функцию, когда компоненты готовы к работе
 * @param {Function} callback выполняется, когда все модули готовы к работе
 * @param {Function} error выполняется, если модули вернули ошибку
 */
export default function ready(callback, error) {
    if (!asyncModules.length) callback();
    else {
        let res = checkModule();
        
        if (res === READY_STATUS.WAITING) {
            const readyInterval = setInterval(() => {
                let res = checkModule();
                if (res !== READY_STATUS.WAITING) {
                    clearInterval(readyInterval);
                    res === READY_STATUS.READY ? callback() : error();
                }
            }, 100);
        } else res === READY_STATUS.READY ? callback() : error();
    }
}

function checkModule() {
    let readyFlag = true,
        errorFlag = false,
        i = asyncModules.length - 1;
    do {
        const module = asyncModules[i];
        readyFlag = readyFlag && module.isReady === READY_STATUS.READY;
        errorFlag = errorFlag || module.isReady === READY_STATUS.ERROR;
    } while (i--);
    if (errorFlag) return READY_STATUS.ERROR;
    if (readyFlag) return READY_STATUS.READY;
    return READY_STATUS.WAITING;
}
