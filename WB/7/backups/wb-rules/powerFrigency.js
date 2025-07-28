function getFrequencyValueByPercent(percent) {
    return 50 * percent;
}
/** команды на включение частотника */
var EStartStopCommand;
(function (EStartStopCommand) {
    EStartStopCommand[EStartStopCommand["Forward"] = 1] = "Forward";
    EStartStopCommand[EStartStopCommand["Stop"] = 2] = "Stop";
    EStartStopCommand[EStartStopCommand["Backward"] = 3] = "Backward";
})(EStartStopCommand || (EStartStopCommand = {}));
var PERCENT_FRIQ_VALUE = [
    getFrequencyValueByPercent(0.5),
    getFrequencyValueByPercent(0.75),
    getFrequencyValueByPercent(1),
];
var LONG_PRESS_TIME_MS = 1000;
/** Управление частотником, по одному сигналу
 * @param inputControl контрол управления частотой и выкллючением/включением
 * @param powerFreqController адрес частотника
 * @param openCloseControl контрол вытяжки (геркон)
 */
function PowerFrequencyHandler(inputControl, powerFreqController, openCloseControl) {
    var timeoutId = null;
    var lastFreqValue = 0;
    var lastCommand = EStartStopCommand.Forward;
    /** состояние старт/стоп  */
    var startStopTopic = "".concat(powerFreqController, "/Start-stop-reverse");
    /** управление частостой */
    var freqValueTopic = "".concat(powerFreqController, "/Frequency");
    /** проверка что частотник запустил нагрузку */
    function isRun() {
        return dev[startStopTopic] !== EStartStopCommand.Stop;
    }
    function setStop() {
        lastCommand = EStartStopCommand.Stop;
        dev[startStopTopic] = EStartStopCommand.Stop;
    }
    function setRun() {
        lastCommand = EStartStopCommand.Forward;
        dev[startStopTopic] = EStartStopCommand.Forward;
    }
    function setFreq(value) {
        dev[freqValueTopic] = value;
    }
    /** обработка нажатия на кнопку*/
    function forvardCommand() {
        timeoutId = setTimeout(function () {
            setStop();
            timeoutId = null;
        }, LONG_PRESS_TIME_MS);
    }
    /** обработка отажатия на кнопку*/
    function backwardCommand() {
        if (!timeoutId) {
            return;
        }
        /** таймер не отработал, значит держали меньше @constant LONG_PRESS_TIME_MS */
        clearTimeout(timeoutId);
        timeoutId = null;
        if (isRun()) {
            lastFreqValue++;
        }
        else {
            /** включаем вытяжку */
            setRun();
        }
        if (lastFreqValue >= PERCENT_FRIQ_VALUE.length) {
            lastFreqValue = 0;
        }
        setFreq(PERCENT_FRIQ_VALUE[lastFreqValue]);
    }
    defineRule("PowerFrequencyHandler_".concat(inputControl), {
        whenChanged: inputControl,
        then: function (newValue) {
            if (dev[openCloseControl]) {
                return;
            }
            if (newValue) {
                forvardCommand();
            }
            else {
                backwardCommand();
            }
        },
    });
    defineRule("PowerFrequencyHandler_".concat(openCloseControl), {
        whenChanged: openCloseControl,
        then: function (newValue) {
            if (!newValue) {
                dev[startStopTopic] = lastCommand;
                setFreq(PERCENT_FRIQ_VALUE[lastFreqValue]);
            }
            else {
                dev[startStopTopic] = EStartStopCommand.Stop;
            }
        },
    });
}
PowerFrequencyHandler("wb-gpio/EXT3_IN7", "t13_frequency_converter_5", "wb-mr6c_28/Input 6");
