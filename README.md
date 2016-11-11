# i3-status-node
A simple NodeJS status bar for i3wm that supports colour.
## How to use 
#### Installation
```
npm install -g i3-status-node
```
#### i3-status-node Configuration
Create a `.i3-status-node` folder in your home folder.

This folder must contain a file named `config.json` which describes the layout of your status bar
and script files that produce the output for each section of the status bar.

```javascript
// ~/.i3-status-node/config.json
{
    'separator_width': 15,
    'layout': [ 'kernel', 'diskusage' ]
}
```

A simple script that would display the kernel version would look like the following

```javascript
// ~/.i3-status-node/kernel.js
var cp = require("child_process"),
    exec = (cmd) => cp.execSync(cmd).toString().replace("\n", "");
    
module.exports = (update) => {
  update(exec("uname -r"));
};
```

The update function can be called with either a string or an object representing a 
[i3bar IPC message block](http://i3wm.org/docs/i3bar-protocol.html#_blocks_in_detail).
Using the IPC format allows for advanced usage such as printing in colour or suppressing the separator. 

```javascript
// ~/.i3-status-node/diskusage.js
var cp = require("child_process"),
    exec = (cmd) => cp.execSync(cmd).toString().replace("\n", "");
    
module.exports = (update) => {
  var updateTime = () => {
    var diskUsedStr = exec("df -hPl / | awk 'NR==2{print $5}'");
    var diskUsedPct = parseInt(diskUsedStr.substring(0, diskUsedStr.length - 1), 10);
    
    update({
      'full_text': diskUsedStr,
      'color': (diskUsedPct > 90) ? '#ff0000' : '#00ff00'
    });
    setTimeout(updateTime, 60 * 1000);
  }
  updateTime();
};
```

The update callback will also accept arrays containing multiple messages in a mixture of either format.
More example scripts can be found in the scripts folder. 

#### i3 Configuration

In the i3 config file change the `status_command` setting to `i3-status-node` like so:
```
// ~/.config/i3/config
...
bar {
  status_command i3-status-node 
}
...
```
