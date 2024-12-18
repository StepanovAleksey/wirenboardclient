function getFrequencyValueByPercent(percent: number) {
  return 50 * percent;
}
/** команды на включение частотника */
enum EStartStopCommand {
  Forward = 1,
  Stop = 2,
  Backward = 3,
}

/** проверка что частотник запустил нагрузку */
function isRun(controllerTopic: string) {
  return dev[controllerTopic] !== EStartStopCommand.Stop;
}

function setStop(controllerTopic: string) {
  dev[controllerTopic] = EStartStopCommand.Stop;
}
function setRun(controllerTopic: string) {
  dev[controllerTopic] = EStartStopCommand.Forward;
}
function setFreq(controllerTopic: string, value: number) {
  dev[controllerTopic] = value;
}

const PERCENT_FRIQ_VALUE = [
  getFrequencyValueByPercent(0.5),
  getFrequencyValueByPercent(0.75),
  getFrequencyValueByPercent(1),
];

const LONG_PRESS_TIME_MS = 2_000;
/** Управление частотником, по одному сигналу */
function PowerFrequencyHandler(
  inputControl: string,
  powerFreqController: string
) {
  let timeoutId: number = null;
  let lastFreqValue = 0;
  /** состояние старт/стоп  */
  const startStopTopic = `${powerFreqController}/Start-stop-reverse`;
  /** управление частостой */
  const freqValueTopic = `${powerFreqController}/Frequency`;

  /** обработка нажатия на кнопку*/
  function forvardCommand() {
    timeoutId = setTimeout(() => {
      setStop(startStopTopic);
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
    if (isRun(startStopTopic)) {
      lastFreqValue++;
    } else {
      /** включаем вытяжку */
      setRun(startStopTopic);
    }
    if (lastFreqValue >= PERCENT_FRIQ_VALUE.length) {
      lastFreqValue = 0;
    }
    setFreq(freqValueTopic, PERCENT_FRIQ_VALUE[lastFreqValue]);
  }

  defineRule(`PowerFrequencyHandler_${inputControl}`, {
    whenChanged: inputControl,
    then: function (newValue: number) {
      if (newValue) {
        forvardCommand();
      } else {
        backwardCommand();
      }
    },
  });
}
PowerFrequencyHandler("wb-gpio/EXT3_IN8", "t13_frequency_converter_5");
