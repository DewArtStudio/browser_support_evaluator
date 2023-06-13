import ELEMENT_TYPES from "./element-types.js";
const types = Object.keys(ELEMENT_TYPES);
console.log(types);
function getSelector(node) {
    let arr = [];
    do {
        arr.push(node.tag.name === undefined ? types[node.type].toLocaleLowerCase() : node.tag.name);
    } while (!!(node = node.parent));

    let res = ". Селектор: ";
    for (let i = arr.length - 1; i > 0; i--) res += arr[i] + " > ";
    res += arr[0];
    return res;
}
const HTML_ERRORS = {
    MESSAGE: (message = "Некорректный синтаксис") => {
        return message;
    },
    MESSAGE_SELECTOR: (node, message = "Некорректный синтаксис") => {
        return message + getSelector(node);
    },
};
export default HTML_ERRORS;
