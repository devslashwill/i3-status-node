var TOTAL_MEMORY_CMD = "free --mega | awk 'NR==2{print $2}'",
    USED_MEMORY_CMD = "free --mega | awk 'NR==2{print $3}'",
    MEMORY_ICON = "\uf080",
    utils = require('./utils'),
    totalMemory = () => utils.exec(TOTAL_MEMORY_CMD),
    usedMemory = () => utils.exec(USED_MEMORY_CMD);

module.exports = function (update) {
    var updateMemory = () => {
        var totalMem = parseInt(totalMemory(), 10);
        var usedMem = parseInt(usedMemory(), 10);
        var percent = 1.0 - ((totalMem - usedMem) / totalMem);

        var result = {
            "full_text": usedMemory() + "MB / " + totalMemory() + "MB"
        };

        if (percent <= 0.33) {
            result['color'] = '#00ff00';
        } else if (percent > 0.33 && percent <= 0.66) {
            result['color'] = '#ffff00';
        } else {
            result['color'] = '#ff0000';
        }

        update(utils.drawIcon(MEMORY_ICON), result);
        setTimeout(updateMemory, 10000);
    };

    updateMemory();
};
