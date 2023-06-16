import URL from "../../utilities/url.js";
import Loader from "../../utilities/loader.js";
export default async function downloadScripts(dom, baseUrl) {
    //Загрузка всех скриптов
    for (let i = 0; i < dom.scripts.length; i++) {
        const e = dom.scripts[i];
        if (e.type === "link") {
            let url = URL.merge(baseUrl, e.value);
            let res = await Loader.get(url.href);
            if (res.loaded) {
                e.type = "text";
                e.value = res.data;
            } else {
                e.parent.children.splice(e.parent.children.indexOf(e));
                dom.scripts.scplice(i);
            }
        }
    }
    return Promise.resolve();
}
