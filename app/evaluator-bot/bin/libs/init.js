import BotDemon from "./bot-demon.js";
import TelegramApi from "node-telegram-bot-api";

const token = process.env.TOKEN;
export const bot = new TelegramApi(token, { polling: true });
export const botDemon = new BotDemon(bot, 500, 5000);
