var DISK_FREE_CMD = "df -hPl / | awk 'NR==2{print $4}'",
    DISK_TOTAL_CMD = "df -hPl / | awk 'NR==2{print $2}'",
    DISK_USED_CMD = "df -hPl / | awk 'NR==2{print $3}'",
    DISK_ICON = "\uf1c0",
    utils = require("./utils"),
    diskFree = () => utils.exec(DISK_FREE_CMD),
    diskTotal = () => utils.exec(DISK_TOTAL_CMD),
    diskUsed = () => utils.exec(DISK_USED_CMD);

module.exports = function (update) {
    var updateDiskUsage = () => {
        var totalDisk = parseFloat(diskTotal());
        var usedDisk = parseFloat(diskUsed());
        var percent = 1.0 - ((totalDisk - usedDisk) / totalDisk);

        var usedText = {
            "full_text": diskUsed() + "B used / " + diskFree() + "B free"
        };
        if (percent >= 0.9) {
            usedText['color'] = '#ff0000';
        }

        update(utils.drawIcon(DISK_ICON), usedText);
        setTimeout(updateDiskUsage, 1000);
    };

    updateDiskUsage();
};