/**
 * @param moveDetectionController сигнал датчика движения
 * @param qController управляемый выход
 * @param lowLvl Нижний порог срабатывания датчика
 * @param debounceTimeSec время на задержку выключения, сек
 * */
function cretaeMoveDetectionRules(
  moveDetectionController: string,
  qController: string,
  lowLvl: number,
  debounceTimeSec: number
) {
  let timeoutId: number = null;
  function clearLastTimeout() {
    if (!!timeoutId) {
      clearTimeout(timeoutId);
    }
  }
  defineRule(`cretaeMoveDetection${moveDetectionController}_up`, {
    asSoonAs: function () {
      return dev[moveDetectionController] >= lowLvl;
    },
    then: function (newValue: number) {
      dev[qController] = true;
      clearLastTimeout();
    },
  });
  defineRule(`cretaeMoveDetection${moveDetectionController}_down`, {
    asSoonAs: function () {
      return dev[moveDetectionController] < lowLvl;
    },
    then: function (newValue: number) {
      clearLastTimeout();
      timeoutId = setTimeout(() => {
        dev[qController] = false;
        timeoutId = null;
      }, debounceTimeSec * 1000);
    },
  });
}
cretaeMoveDetectionRules(
  "wb-msw-v4_91/Current Motion",
  "wb-mr6c_54/K4",
  22,
  10
);
cretaeMoveDetectionRules(
  "wb-msw-v3_15/Current Motion",
  "wb-mr6c_29/K1",
  22,
  10
);

