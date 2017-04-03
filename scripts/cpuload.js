var CPU_ICON = "\uf0e4",
    os = require('os'),
    utils = require('./utils');

var startMeasure;

function cpuAverage() {
  // Initialise sum of idle and time of cores and fetch CPU info
  var totalIdle = 0, totalTick = 0;
  var cpus = os.cpus();

  // Loop through CPU cores
  for (var i = 0, len = cpus.length; i < len; i++) {

    // Select CPU core
    var cpu = cpus[i];

    // Total up the time in the cores tick
    for (type in cpu.times) {
      totalTick += cpu.times[type];
    }

    // Total up the idle time of the core
    totalIdle += cpu.times.idle;
  }

  // Return the average Idle and Tick times
  return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
}

function getCpuLoad() {
    if (startMeasure == null) {
        //Grab first CPU Measure
        startMeasure = cpuAverage();

        return '';
    } else {
        //Grab second Measure
        var endMeasure = cpuAverage();

        //Calculate the difference in idle and total time between the measures
        var idleDifference = endMeasure.idle - startMeasure.idle;
        var totalDifference = endMeasure.total - startMeasure.total;

        //Calculate the average percentage CPU usage
        var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);

        startMeasure = endMeasure;

        return percentageCPU;
    }
}


module.exports = function (update) {
    var updateCPU = () => {
        var cpuLoad = getCpuLoad();
        var cpuLoadStr = ('   ' + cpuLoad).slice(-3);
        var result = { "full_text": cpuLoadStr + "%" };
        if (cpuLoad > 90) {
            result['color'] = '#ff0000';
        }

        update(utils.drawIcon(CPU_ICON), result);
        setTimeout(updateCPU, 3000);
    };

    updateCPU();
};
