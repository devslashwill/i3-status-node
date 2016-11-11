var cp = require("child_process");

module.exports = {
    // Draw an icon without color or separator
    drawIcon: (icon) => {
        return  {
            "full_text": icon,
            "separator": false
        };
    },
    // Execute a command
    exec: (cmd) => cp.execSync(cmd).toString().replace("\n", "")
};
