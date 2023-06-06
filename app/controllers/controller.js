import express from "express";
import bodyParser from "body-parser";
import http from "http";
import browserEvaluator from "../model/requests.js/browser-evaluator.js";
// import https from "https";
import cors from "cors";
// import rateLimit from "express-rate-limit";
const app = express();
app.use(
    cors({
        origin: "*",
        credentials: true,
        optionSuccessStatus: 200,
    })
);
// app.use(rateLimit(configs.rateLimit));

export default function controller() {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use((error, req, res, next) => {
        res.status(400);
        res.json();
    });

    /**Обрабатывает данные из формы*/
    app.get("/connection", (req, res) => {
        res.send(JSON.stringify({ connect: true }));
    });
	app.post("/browser_evaluator", async (req, res) => {
        res.send(JSON.stringify(await browserEvaluator(req.body.url)));
    });

    //СОЗДАНИЕ СЕРВЕРОВ
    http.createServer(app).listen(80);
    //https.createServer(configs.ssl, app).listen(443);
}
