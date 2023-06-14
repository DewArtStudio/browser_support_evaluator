/**
 * @private
 * @ignore
 */
class ChatStreams {
    _queue = [];
    _remoteQueue;
    _demon;
    _timerStream;
    _chunkMessage = 4;
    _counter = 0;
    constructor(demon, delay = 4000) {
        console.log("НОВЫЙ ПОТОК ЧАТА");
        this._demon = demon;
        this._delay = delay;
    }

    push(value) {
        this._queue.push(value);
        this._call();
    }

    _counter = 0;
    resetDelay() {
        this._counter = 0;

        clearInterval(this._interval);
        this._interval = setInterval(() => {
            this._counter = 0;
            this._run();
        }, 4000);
        this._run();
    }

    _call() {
        if (this._counter < this._chunkMessage) {
            this._run();
        } else {
            if (this._interval === undefined) {
                this._run();
                this._interval = setInterval(() => {
                    this._counter = 0;
                    this._run();
                }, this._delay);
            }
        }
    }
    /**
     * @private
     * @ignore
     */
    _run() {
        if (!this._queue.length) this._clearInterval();
        let loop = Math.min(this._queue.length, this._chunkMessage - this._counter);
        for (let i = 0; i < loop; i++) {
            if (this._counter < this._chunkMessage) {
                if (this._queue !== undefined && this._queue.length !== 0) {
                    if (this._demon._queue === undefined) this._demon._queue = [];
                    this._counter++;
                    this._demon._queue.push(this._queue.shift());
                    this._demon._call();
                } else this._clearInterval();
            } else break;
        }
    }
    _clearInterval() {
        this._queue = [];
        clearInterval(this._interval);
        this._interval = undefined;
    }
}

/**
 * @class Демон отправки ограниченного количества сообщений в секунду
 */
export default class BotDemon {
    static _errors = 0;
    /**
     * @private
     * @ignore
     */
    _bot;
    /**
     * @private
     * @ignore
     */
    _chatStreams;
    /**
     * @private
     * @ignore
     */
    _queue = [];
    /**
     * @private
     * @ignore
     */
    _interval;
    /**
     * @private
     * @ignore
     */
    _delay;
    /**
     * @private
     * @ignore
     */
    static _id = 0;
    /**
     * @private
     * @ignore
     */
    static _bots = [];
    /**
     * @private
     * @ignore
     */

    /**
     * Создает демон для отправки сообщений
     * @param {TelegramBot} bot ссылка на Telegram бота
     * @param {Number} delay интервал между сообщениями для всех чатов
     * @param {Number} chatDelay интервал между сообщениями чата
     */
    constructor(bot, delay = 35, chatDelay = 5000) {
        if (BotDemon._bots.includes(bot)) throw Error("Bot already added");
        this._bot = bot;
        this._delay = delay;
        this._chatDelay = chatDelay;
        this._chatStreams = new Map();
        bot.on("message", (message) => {
            const chatId = message.chat.id;
            let chatStream = this._chatStreams.get("" + chatId);
            if (chatStream !== undefined) {
                chatStream.resetDelay();
            }
        });
        this._interval = setInterval(() => {
            this._run();
        }, this._delay);
        console.log(`| BOT DEMON №${BotDemon._id++} RUNNING |`);
    }

    _call() {}

    _run() {
        if (this._queue !== undefined && this._queue.length !== 0) {
            let sendData = this._queue[0];
            console.log("ОТПРАВИЛ");
            this._bot[sendData.method](...this._queue[0].configs)
                .then((data) => {
                    console.log("ОК");
                    this._queue.shift();
                    return data;
                })
                .catch(BotDemon._errors++);
        }
    }

    _prepareConfigs(configs) {
        let keys = Object.keys(configs);
        let result = [];
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (configs[key] !== undefined) {
                result.push(configs[key]);
            }
        }
        return result;
    }

    _getConfigs() {
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
        }
    }

    _send(configs, method) {
        let id = "" + configs[0];
        let chatStream = this._chatStreams.get(id);
        if (chatStream === undefined) {
            chatStream = new ChatStreams(this, this._chatDelay);
            chatStream.push({ configs, method });
            this._chatStreams.set(id, chatStream);
        } else {
            chatStream.push({ configs, method });
        }
    }

    sendAnimation(chatId, animation, options) {
        this._send(this._prepareConfigs({ chatId, animation, options }), "sendAnimation");
    }
    sendAudio(chatId, audio, options) {
        this._send(this._prepareConfigs({ chatId, audio, options }), "sendAudio");
    }
    sendChatAction(chatId, action, options) {
        this._send(this._prepareConfigs({ chatId, action, options }), "sendChatAction");
    }
    sendContact(chatId, phoneNumber, firstname, options) {
        this._send(this._prepareConfigs({ chatId, phoneNumber, firstname, options }), "sendContact");
    }
    sendVoice(chatId, phoneNumber, firstname, options, fileOptions) {
        this._send(
            this._prepareConfigs({
                chatId,
                phoneNumber,
                firstname,
                options,
                fileOptions,
            }),
            "sendVoice"
        );
    }
    sendDice(chatId, options) {
        this._send(this._prepareConfigs({ chatId, options }), "sendDice");
    }
    sendDocument(chatId, doc, options, fileOptions) {
        this._send(this._prepareConfigs({ chatId, doc, options, fileOptions }), "sendDocument");
    }
    sendGame(chatId, gameShortName, options) {
        this._send(this._prepareConfigs({ chatId, gameShortName, options }), "sendGame");
    }
    sendInvoice(chatId, title, descriotion, payload, providerToken, startParameter, currency, prices, options) {
        this._send(
            this._prepareConfigs({
                chatId,
                title,
                descriotion,
                payload,
                providerToken,
                startParameter,
                currency,
                prices,
                options,
            }),
            "sendInvoice"
        );
    }
    sendLocation(chatId, latitude, lognitude, options) {
        this._send(this._prepareConfigs({ chatId, latitude, lognitude, options }), "");
    }
    sendMediaGroup(chatId, media, options) {
        this._send(this._prepareConfigs({ chatId, media, options }), "sendMediaGroup");
    }
    sendMessage(chatId, text, options) {
        this._send(this._prepareConfigs({ chatId, text, options }), "sendMessage");
    }
    sendPhoto(chatId, photo, options) {
        this._send(this._prepareConfigs({ chatId, photo, options }), "sendPhoto");
    }
    sendPoll(chatId, question, pollOptions, options) {
        this._send(this._prepareConfigs({ chatId, question, pollOptions, options }), "sendPoll");
    }
    sendSticker(chatId, sticker, options, fileOptions) {
        this._send(this._prepareConfigs({ chatId, sticker, options, fileOptions }), "sendSticker");
    }
    sendVenue(chatId, latitude, longitude, title, addres, options) {
        this._send(
            this._prepareConfigs({
                chatId,
                latitude,
                longitude,
                title,
                addres,
                options,
            }),
            "sendVenue"
        );
    }
    sendVideo(chatId, video, options, fileOptions) {
        this._send(this._prepareConfigs({ chatId, video, options, fileOptions }), "sendVideo");
    }
    sendVideoNote(chatId, videoNote, options, fileOptions) {
        this._send(this._prepareConfigs({ chatId, videoNote, options, fileOptions }), "sendVideoNote");
    }
    _deleteChatStream(chatId) {}
}
