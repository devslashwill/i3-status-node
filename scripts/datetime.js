var utils = require('./utils'),
    TIME_ICON = "\uf073";

module.exports = (update) => {
    var updateTime = () => {
        function leadingZero(number) {
            return ("0" + number).slice(-2);
        }

        var d = new Date(),
            hours = leadingZero(d.getHours()),
            minutes = leadingZero(d.getMinutes()),
            seconds = leadingZero(d.getSeconds()),
            day = leadingZero(d.getDate()),
            month = leadingZero(d.getMonth() + 1),
            year = d.getFullYear();

        update(utils.drawIcon(TIME_ICON),
            [
                [ day, month, year].join("/"),
                [ hours, minutes, seconds].join(":")
            ].join(" "));

        setTimeout(updateTime, 1000);
    };

    updateTime();
};
