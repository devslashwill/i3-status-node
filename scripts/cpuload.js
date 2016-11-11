var CPU_PERCENTAGE_CMD = "mpstat | awk 'NR==4{print $12}'",
    CPU_ICON = "\uf0e4",
    utils = require('./utils'),
    cpuIdle = () => utils.exec(CPU_PERCENTAGE_CMD);

module.exports = function (update) {
    var updateCPU = () => {
        var cpuLoad = (100.0 - parseFloat(cpuIdle().replace(",", "."))).toFixed(2);
        var result = { "full_text": cpuLoad + "%" };
        if (cpuLoad > 90) {
            result['color'] = '#ff0000';
        }

        update(utils.drawIcon(CPU_ICON), result);
        setTimeout(updateCPU, 3000);
    };

    updateCPU();
};
