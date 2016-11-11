#!/usr/bin/env node
/**
 * i3-status-node by Will Homer.
 * Based on threebar by erickzanardo (https://github.com/erickzanardo/threebar)
 * Example scripts based on the fork by alexandremello (https://github.com/alexandremello/threebar/tree/new-font)
 *
 * MIT Licensed.
 */
var fs = require("fs");
var path = require("path");

const flatten = (arr) => arr.reduce((flat, next) => flat.concat(next), []);
const flatMap = (arr, acc) => flatten(arr.map(acc));

var userDir = process.env.HOME || process.env.USERPROFILE;
var configDir = path.join(userDir, ".i3-status-node");
var layoutFilePath = path.join(configDir, "config.json");

var scriptOutput = {};
var layoutData, separatorWidth;
var initialized = false;

var createIPCMessage = (text, isError) => {
    var message = {"full_text": text};
    if (isError)
        message["color"] = "#ff0000";
    return message;
};

var printOutput = () => {
    var output = flatMap(layoutData, (scriptName) => {
        var outputBlock = scriptOutput[scriptName] || createIPCMessage("Error in " + scriptName, true);
        if (!outputBlock.hasOwnProperty("separator_block_width"))
            outputBlock["separator_block_width"] = separatorWidth;

        return outputBlock;
    });

    process.stdout.write(JSON.stringify(output) + ",");
};

var outputHandler = (scriptName) => {
    return function () {
        var encodeResult = (result) => {
            if (Array.isArray(result))
                return flatMap(result, (r) => encodeResult(r));
            else if (typeof(result) == "string")
                return createIPCMessage(result);
            else
                return result;
        };

        scriptOutput[scriptName] = encodeResult(Array.prototype.slice.call(arguments));

        if (initialized)
            printOutput();
    };
};

process.stdout.write(JSON.stringify({
    "version": 1
}) + "[");

fs.readFile(layoutFilePath, (error, data) => {
    if (error)
        throw console.error("Failed to read config.json", error);

    var configData = JSON.parse(data.toString());
    try {
        layoutData = configData.layout || [];
        separatorWidth = configData.separatorWidth || 9;
    } catch (error) {
        throw console.error("Error parsing config.json", error);
    }

    fs.readdir(configDir, (error, files) => {
        if (error)
            throw console.error("Failed to read the config directory", error);

        files.forEach((file) => {
            if (!file.endsWith(".js"))
                return;

            var filePath = path.join(configDir, file);
            var fileName = file.substring(0, file.length - 3);

            if (!layoutData.includes(fileName))
                return;

            var script = require(filePath);
            if (typeof(script) == "function")
                script(outputHandler(fileName))
        });

        initialized = true;
        printOutput();
    });
});

process.stdin.resume();