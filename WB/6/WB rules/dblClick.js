var counter_short_1 = null;
var counter_long_1 = null;
defineRule({
  whenChanged: "wb-mr6c_28/Input 4",
  then: function (newValue, devName, cellName) {
    if (!newValue) {
      return;
    }
    if (counter_short_1) {
      dev["wb-mr6c_28/K2"] = !dev["wb-mr6c_28/K2"];

      clearTimeout(counter_short_1);
      if (counter_long_1) {
        clearTimeout(counter_long_1);
      }
      counter_short_1 = null;
      counter_long_1 = null;
      return;
    }
    if (counter_long_1) {
      dev["wb-mr6c_28/K3"] = !dev["wb-mr6c_28/K3"];
      clearTimeout(counter_long_1);
      if (counter_short_1) {
        clearTimeout(counter_short_1);
      }
      counter_short_1 = null;
      counter_long_1 = null;
      return;
    }
    counter_short_1 = setTimeout(function () {
      counter_short_1 = null;
    }, 500);
    counter_long_1 = setTimeout(function () {
      dev["wb-mr6c_28/K5"] = !dev["wb-mr6c_28/K5"];
      counter_long_1 = null;
    }, 1000);
  },
});
