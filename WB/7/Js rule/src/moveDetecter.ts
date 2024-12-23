/** Нижний порог срабатывания датчика */
const LOW_LEVEL_ACC = 22;
/** время на задержку выключения */
const MOVE_DETECTION_DEBOUNCE_TIME_MS = 120_000;

/**
 * @param moveDetectionController сигнал датчика движения
 * @param qController управляемый выход
 * */
function cretaeMoveDetectionRules(
  moveDetectionController: string,
  qController: string
) {
  let timeoutId: number = null;
  defineRule(`cretaeMoveDetection${moveDetectionController}_up`, {
    asSoonAs: function () {
      return dev[moveDetectionController] >= LOW_LEVEL_ACC;
    },
    then: function (newValue: number) {
      dev[qController] = 1;
      clearTimeout(timeoutId);
    },
  });
  defineRule(`cretaeMoveDetection${moveDetectionController}_down`, {
    asSoonAs: function () {
      return dev[moveDetectionController] < LOW_LEVEL_ACC;
    },
    then: function (newValue: number) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        dev[qController] = 0;
        timeoutId = null;
      }, MOVE_DETECTION_DEBOUNCE_TIME_MS);
    },
  });
}
cretaeMoveDetectionRules("wb-msw-v4_91/Current Motion", "wb-mr6c_54/K4");
