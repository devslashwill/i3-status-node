var KERNEL_CMD = "uname -r",
    KERNEL_ICON = "\uf120",
    utils = require('./utils'),
    kernelVersion = () => utils.exec(KERNEL_CMD);

module.exports = (update) => {
    var updateKernel = () => {
        update(utils.drawIcon(KERNEL_ICON), kernelVersion());
        setTimeout(updateKernel, 1000 * 60 * 30);
    };

    updateKernel();
};
