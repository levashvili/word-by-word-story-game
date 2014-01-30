/**
 * Backbone localStorage Adapter
 * Version 1.1.7
 *
 * https://github.com/jeromegn/Backbone.localStorage
 */
(function (root, factory) {
    if (typeof exports === 'object' && typeof require === 'function') {
        module.exports = factory(require("underscore"), require("backbone"));
    } else if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["underscore","backbone"], function(_, Backbone) {
            // Use global variables if the locals are undefined.
            return factory(_ || root._, Backbone || root.Backbone);
        });
    } else {
        // RequireJS isn't being used. Assume underscore and backbone are loaded in <script> tags
        factory(_, Backbone);
    }
}(this, function(_, Backbone) {
// A simple module to replace `Backbone.sync` with *localStorage*-based
// persistence. Models are given GUIDS, and saved into a JSON object. Simple
// as that.

// Hold reference to Underscore.js and Backbone.js in the closure in order
// to make things work even if they are removed from the global namespace

// Generate four random hex digits.
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };

// Generate a pseudo-GUID by concatenating random hexadecimal.
    function guid() {
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    };

// Our Store is represented by a single JS object in *localStorage*. Create it
// with a meaningful name, like the name you'd give a table.
// window.Store is deprecated, use Backbone.LocalStorage instead
    Backbone.WebSocketsStorage = window.Store = function(name) {
        if( !this.webSocketsStorage ) {
            throw "Backbone.webSocketsStorage: Environment does not support webSocketsStorage."
        }
        this.name = name;
        var store = this.webSocketsStorage().getItem(this.name);
        this.records = (store && store.split(",")) || [];
    };

    _.extend(Backbone.WebSocketsStorage.prototype, {

        // Save the current state of the **Store** to *localStorage*.
        save: function() {
            this.localStorage().setItem(this.name, this.records.join(","));
        },

        // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
        // have an id of it's own.
        create: function(model) {
            if (!model.id) {
                model.id = guid();
                model.set(model.idAttribute, model.id);
            }
            this.localStorage().setItem(this.name+"-"+model.id, JSON.stringify(model));
            this.records.push(model.id.toString());
            this.save();
            return this.find(model);
        },

        // Update a model by replacing its copy in `this.data`.
        update: function(model) {
            this.localStorage().setItem(this.name+"-"+model.id, JSON.stringify(model));
            if (!_.include(this.records, model.id.toString()))
                this.records.push(model.id.toString()); this.save();
            return this.find(model);
        },

        // Retrieve a model from `this.data` by id.
        find: function(model) {
            return this.jsonData(this.localStorage().getItem(this.name+"-"+model.id));
        },

        // Return the array of all models currently in storage.
        findAll: function() {
            // Lodash removed _#chain in v1.0.0-rc.1
            return (_.chain || _)(this.records)
                .map(function(id){
                    return this.jsonData(this.localStorage().getItem(this.name+"-"+id));
                }, this)
                .compact()
                .value();
        },

        // Delete a model from `this.data`, returning it.
        destroy: function(model) {
            if (model.isNew())
                return false
            this.localStorage().removeItem(this.name+"-"+model.id);
            this.records = _.reject(this.records, function(id){
                return id === model.id.toString();
            });
            this.save();
            return model;
        },

        webSocketsStorage: function() {
            return webSocketsStorage;
        },

        // fix for "illegal access" error on Android when JSON.parse is passed null
        jsonData: function (data) {
            return data && JSON.parse(data);
        },

        // Clear localStorage for specific collection.
        _clear: function() {
            var local = this.localStorage(),
                itemRe = new RegExp("^" + this.name + "-");

            // Remove id-tracking item (e.g., "foo").
            local.removeItem(this.name);

            // Lodash removed _#chain in v1.0.0-rc.1
            // Match all data items (e.g., "foo-ID") and remove.
            (_.chain || _)(local).keys()
                .filter(function (k) { return itemRe.test(k); })
                .each(function (k) { local.removeItem(k); });

            this.records.length = 0;
        },

        // Size of localStorage.
        _storageSize: function() {
            return this.localStorage().length;
        }

    });

// localSync delegate to the model or collection's
// *localStorage* property, which should be an instance of `Store`.
// window.Store.sync and Backbone.localSync is deprecated, use Backbone.LocalStorage.sync instead
    Backbone.WebSocketsStorage.sync = window.Store.sync = Backbone.webSocketsSync = function(method, model, options) {
        var store = model.webSocketsStorage || model.collection.webSocketsStorage;

    };

    Backbone.ajaxSync = Backbone.sync;

    Backbone.getSyncMethod = function(model) {
        if(model.localStorage || (model.collection && model.collection.localStorage)) {
            return Backbone.localSync;
        }
        if(model.webSocketsStorage || (model.collection && model.collection.webSocketsStorage)) {
            return Backbone.webSocketsSync;
        }
        return Backbone.ajaxSync;
    };

// Override 'Backbone.sync' to default to localSync,
// the original 'Backbone.sync' is still available in 'Backbone.ajaxSync'
    Backbone.sync = function(method, model, options) {
        return Backbone.getSyncMethod(model).apply(this, [method, model, options]);
    };

    return Backbone.LocalStorage;
}));
