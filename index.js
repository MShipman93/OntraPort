/**
 * Created by Matt Shipman on 17/05/16.
 *
 * Note:
 * This package is not offically made by OntraPort, so no help can be given if
 * anything outside this package doesn't work correctly.
 */
var https = require('https');

/**
 * Callback used for most API calls
 *
 * @param err String
 * @param res String
 */
var defaultCallback = function(err, res, callback) {

    if(err) {
        return callback(err, undefined);
    }

    return callback(undefined, res);

};

/**
 * Function called to send all API requests
 *
 * @param reqType String
 * @param data String
 * @param callback function(error, response)
 */
var sendAPIRequest = function(config, reqType, data, callback) {

    if(typeof config !== 'object')
        return callback('Config not set', undefined);

    // Check that appid is set in config
    if(config.appid == undefined)
        return callback('No appid set in config', undefined);

    // Check that key is set in config
    if(config.key == undefined)
        return callback('No key set in config', undefined);

    // Body to write to https request
    var body =
        "appid=" + config.appid +
        "&key=" + config.key +
        "&reqType=" + reqType +
        "&data=" + encodeURIComponent(data);

    // Options for https request
    var options = {
        host: 'api.moon-ray.com',
        path: '/cdata.php',
        method: 'POST',
        headers: {
            "Content-Type":"application/x-www-form-urlencoded",
            "Content-Length":body.length
        }
    };

    // Request https request
    var req = https.request(options, function(res) {
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', function(data) {
            responseString += data;
        });

        res.on('error', function(err) {
            return callback(err);
        });

        res.on('end', function() {
            return callback(undefined, responseString);
        });
    });

    // Write body to request and end request
    req.write(body);
    req.end();

};





/**
 * Empty constructor
 *
 * @params config Object (requires appid and key)
 */
function OntraPort(config) {

    this.config = config;

}

/**
 * Adds a new contact
 *
 * @param data String
 * @param callback function(error, response)
 *
 * Example:
 * add("<contact><field name='First Name'>Matt</field></contact>", function(err, res))
 *
 * API Documentation:
 * https://support.ontraport.com/hc/en-us/articles/217882218-Contacts-API#add
 */
OntraPort.prototype.add = function(data, callback) {

    sendAPIRequest(this.config, "add", data, function(err, res) {
        defaultCallback(err, res, callback);
    });

};

/**
 * Searches for contacts that meet the query
 *
 * @param data String
 * @param callback function(error, response)
 *
 * Example:
 * search("<search><equation><field>E-Mail</field><op>e</op><value>test@test.com</value></equation></search>", function(err, res))
 *
 * API Documentation:
 * https://support.ontraport.com/hc/en-us/articles/217882218-Contacts-API#search
 */
OntraPort.prototype.search = function(data, callback) {

    sendAPIRequest(this.config, "search", data, function(err, res) {
        defaultCallback(err, res, callback);
    });

};

/**
 * Adds a tag to a contact
 *
 * @param data String
 * @param callback function(error, response)
 *
 * Example:
 * addTag("<contact id='12345'><tag>Admin</tag></contacts>", function(err, res))
 *
 * Example:
 * addTag("<contact id='12345'><tag>Admin</tag><tag>Super-Admin</tag></contact>", function(err, res))
 *
 * NOTE: addTag supports multiple tags
 */
OntraPort.prototype.addTag = function(data, callback) {

    sendAPIRequest(this.config, "add_tag", data, function(err, res) {
        defaultCallback(err, res, callback);
    });

};

/**
 * Adds a tag to a contact
 *
 * @param contactId String
 * @param tag String
 * @param callback function(error, response)
 *
 * Example:
 * addJsonTag("12345", "Admin", function(err, res))
 */
OntraPort.prototype.addJsonTag = function(contactId, tag, callback) {

    var data =
        "<contact id='" + contactId + "'>" +
        "   <tag>" + tag + "</tag>" +
        "</contact>";

    this.addTag(data, callback);

};

/**
 * Adds a tags to a contact
 *
 * @param contactId String
 * @param tags Array
 * @param callback function(error, response)
 *
 * Example:
 * addJsonTag("12345", ["Admin", "Super-Admin"], function(err, res))
 *
 * NOTE: addTag supports multiple tags
 */
OntraPort.prototype.addJsonTags = function(contactId, tags, callback) {

    if(tags.length == 0)
        return callback('Empty array passed', undefined);

    // Reduce array to single string of tags
    var tagsString = tags.reduce(function(string, tag){ return string + '<tag>' + tag + '</tag>' }, '');

    var data = "<contact id='" + contactId + "'>" + tagsString + "</contact>";

    this.addTag(data, callback);

};

/**
 * Update dates fields for a contact
 *
 * @param data String
 * @param callback function(error, response)
 *
 * Example:
 * update("<contact id='12345'><field name='FirstName'>Matt</field></contact>", function(err, res))
 *
 * API Documentation:
 * https://support.ontraport.com/hc/en-us/articles/217882218-Contacts-API#update
 */
OntraPort.prototype.update = function(data, callback) {

    sendAPIRequest(this.config, "update", data, function(err, res) {
        defaultCallback(err, res, callback);
    });

};

module.exports = OntraPort;
