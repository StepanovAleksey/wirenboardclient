"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YandexWbAlice = void 0;
const yandex_dialogs_sdk_1 = require("yandex-dialogs-sdk");
class YandexWbAlice {
    constructor(port = 3001, wbClient) {
        this.wbClient = wbClient;
        this.alice = new yandex_dialogs_sdk_1.Alice();
        this.server = null;
        this.server = this.alice.listen(port, '/');
        this.init();
    }
    init() {
        this.alice.command('Привет', ctx => yandex_dialogs_sdk_1.Reply.text('Да да я знаю!'));
        this.alice.command('Включи свет', ctx => {
            this.wbClient.send('/devices/wb-mr6c_28/controls/K1/on', 1);
            return yandex_dialogs_sdk_1.Reply.text('Хорошо');
        });
        this.alice.command('Выключи свет', ctx => {
            this.wbClient.send('/devices/wb-mr6c_28/controls/K1/on', 0);
            return yandex_dialogs_sdk_1.Reply.text('Хорошо');
        });
        this.alice.command('', ctx => {
            console.log(ctx);
            return yandex_dialogs_sdk_1.Reply.text('огого');
        });
    }
}
exports.YandexWbAlice = YandexWbAlice;
//# sourceMappingURL=yandexAlise.js.map