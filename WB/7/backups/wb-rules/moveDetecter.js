/**
 * @param moveDetectionController сигнал датчика движения
 * @param qController управляемый выход
 * @param lowLvl Нижний порог срабатывания датчика
 * @param debounceTimeSec время на задержку выключения, сек
 * */
function cretaeMoveDetectionRules(moveDetectionController, qController, lowLvl, debounceTimeSec) {
    var timeoutId = null;
    function clearLastTimeout() {
        if (!!timeoutId) {
            clearTimeout(timeoutId);
        }
    }
    defineRule("cretaeMoveDetection".concat(moveDetectionController, "_up"), {
        asSoonAs: function () {
            return dev[moveDetectionController] >= lowLvl;
        },
        then: function (newValue) {
            dev[qController] = true;
            clearLastTimeout();
        },
    });
    defineRule("cretaeMoveDetection".concat(moveDetectionController, "_down"), {
        asSoonAs: function () {
            return dev[moveDetectionController] < lowLvl;
        },
        then: function (newValue) {
            clearLastTimeout();
            timeoutId = setTimeout(function () {
                dev[qController] = false;
                timeoutId = null;
            }, debounceTimeSec * 1000);
        },
    });
}
cretaeMoveDetectionRules("wb-msw-v4_91/Current Motion", "wb-mr6c_54/K4", 22, 10);
cretaeMoveDetectionRules("wb-msw-v3_15/Current Motion", "wb-mr6c_29/K1", 22, 10);
