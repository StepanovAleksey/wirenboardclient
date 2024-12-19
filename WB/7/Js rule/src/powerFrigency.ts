function getFrequencyValueByPercent(percent: number) {
  return 50 * percent;
}
/** команды на включение частотника */
enum EStartStopCommand {
  Forward = 1,
  Stop = 2,
  Backward = 3,
}

const PERCENT_FRIQ_VALUE = [
  getFrequencyValueByPercent(0.5),
  getFrequencyValueByPercent(0.75),
  getFrequencyValueByPercent(1),
];

const LONG_PRESS_TIME_MS = 1_000;

/** Управление частотником, по одному сигналу
 * @param inputControl контрол управления частотой и выкллючением/включением
 * @param powerFreqController адрес частотника
 * @param openCloseControl контрол вытяжки (геркон)
 */
function PowerFrequencyHandler(
  inputControl: string,
  powerFreqController: string,
  openCloseControl: string
) {
  let timeoutId: number = null;
  let lastFreqValue = 0;
  let lastCommand = EStartStopCommand.Forward;
  /** состояние старт/стоп  */
  const startStopTopic = `${powerFreqController}/Start-stop-reverse`;

  /** управление частостой */
  const freqValueTopic = `${powerFreqController}/Frequency`;

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

  function setFreq(value: number) {
    dev[freqValueTopic] = value;
  }

  /** обработка нажатия на кнопку*/
  function forvardCommand() {
    timeoutId = setTimeout(() => {
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
    } else {
      /** включаем вытяжку */
      setRun();
    }
    if (lastFreqValue >= PERCENT_FRIQ_VALUE.length) {
      lastFreqValue = 0;
    }
    setFreq(PERCENT_FRIQ_VALUE[lastFreqValue]);
  }

  defineRule(`PowerFrequencyHandler_${inputControl}`, {
    whenChanged: inputControl,
    then: function (newValue: number) {
      if (dev[openCloseControl]) {
        return;
      }
      if (newValue) {
        forvardCommand();
      } else {
        backwardCommand();
      }
    },
  });

  defineRule(`PowerFrequencyHandler_${openCloseControl}`, {
    whenChanged: openCloseControl,
    then: function (newValue: number) {
      if (!newValue) {
        dev[startStopTopic] = lastCommand;
        setFreq(PERCENT_FRIQ_VALUE[lastFreqValue]);
      } else {
        dev[startStopTopic] = EStartStopCommand.Stop;
      }
    },
  });
}
PowerFrequencyHandler(
  "wb-gpio/EXT3_IN7",
  "t13_frequency_converter_5",
  "wb-mr6c_28/Input 6"
);
