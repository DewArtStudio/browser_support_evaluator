function getSelector(node) {
    let arr = [];
    while (node !== undefined) {
        arr.push(node.node);
        node = node.parent;
    }
    let i = arr.length - 1;
    let res = "Selector: ";
    do {
        res += arr[i] + " > ";
    } while (i--);
    res += "#";
    return res;
}
const HTMLErrors = {
    MULTIPLE_BODY: "На странице обнаружено более 1 тега <body>...</body>",
    MULTIPLE_HEAD: "На странице обнаружено более 1 тега <head>...</head>",
    MISSING_LINK: (node) => {
        return `В теге <a></a> отсутствует ссылка. ${getSelector(node)}`;
    },
    MISSING_STYLE: (node) => {
        return `Отсутствует ссылка на файл стилей. ${getSelector(node)}`;
    },
    STYLE_SYNTAX_ERROR: (node) => {
        return `Содержимое узла <style></style> некорректно или отсутствует. ${getSelector(node)}`;
    },
};
export default HTMLErrors;
