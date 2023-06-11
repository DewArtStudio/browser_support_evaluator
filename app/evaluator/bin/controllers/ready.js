import READY_STATUS from "../enums/ready-status.js";
import components from "../model/info/components.js";
/**
 * Выполняет callback функцию, когда компоненты готовы к работе
 * @param {Function} callback
 * @param {Function} error
 */
export default function ready(callback, error) {
    callback()
    // const modulesToCheck = [support];
    // const readyInterval = setInterval(() => {
    //     let readyFlag = true,
    //         errorFlag = false;
    //     for (let i = 0; i < modulesToCheck.length; i++) {
    //         const module = modulesToCheck[i];
    //         readyFlag = module.isReady === READY_STATUS.READY && readyFlag;
    //         errorFlag = errorFlag || module.isReady === READY_STATUS.ERROR;
    //     }

    //     if (errorFlag) {
    //         clearInterval(readyInterval);
    //         error();
    //         return;
    //     }
    //     if (readyFlag) {
    //         console.log("| ALL COMPONENT READY |");
    //         clearInterval(readyInterval);
    //         callback();
    //         return;
    //     }
    // }, 200);
}
