import express from "express";
import bodyParser from "body-parser";
import http from "http";
import evaluateSupport from "../model/api/browser-evaluator.js";
// import https from "https";
import cors from "cors";
import ready from "./ready.js";
import READY_STATUS from "../enums/ready-status.js";
// import rateLimit from "express-rate-limit";

const HTTP_PORT = process.env.HTTP_PORT || 80;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;
const EVALUATION_REQUEST = process.env.EVALUATION_REQUEST || "/evaluation";
const app = express();
const isReady = { status: READY_STATUS.WAITING };
app.use(
    cors({
        origin: "*",
        credentials: true,
        optionSuccessStatus: 200,
    })
);
// app.use(rateLimit(configs.rateLimit));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((error, req, res, next) => {
    res.status(400);
    res.json();
});
http.createServer(app).listen(HTTP_PORT);
//https.createServer(configs.ssl, app).listen(HTTPS_PORT);
app.post(`${EVALUATION_REQUEST}-ready`, (req, res) => {
    res.send(JSON.stringify(isReady));
});

export default function controller() {
    ready(
        () => {
            app.post(EVALUATION_REQUEST, async (req, res) => {
                const supportAssessment = await evaluateSupport(req.body.url);
                res.send(JSON.stringify(supportAssessment));
            });
            isReady.status = READY_STATUS.READY;
        },
        () => {
            console.log(`ERROR! Module not ready`);
            isReady.status = READY_STATUS.ERROR;
        }
    );
}
