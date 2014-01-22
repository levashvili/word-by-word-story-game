require.config({
    baseUrl: "../src/",
    urlArgs: 'cb=' + Math.random(),
    paths: {
        jquery: '../lib/jquery/jquery-1.10.2',
        underscore: '../lib/underscore/underscore',
        backbone: '../lib/backbone/backbone',
        localStorage: '../lib/backbone/backbone.localStorage',
        jasmine: '../lib/jasmine-1.3.1/jasmine',
        'jasmine-html': '../lib/jasmine-1.3.1/jasmine-html',
        //'jasmine-boot': '../lib/jasmine-2.0.0/boot',
        spec: '../tests/spec',
        //'text-area-view': '../src/views/text-area'
        text: '../lib/require/text'
    },
    shim: {
        underscore: {
            exports: "_"
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'backbone.localStorage': {
            deps: ['backbone'],
            exports: 'Backbone'
        },
        jasmine: {
            exports: 'jasmine'
        },
        'jasmine-html': {
            deps: ['jasmine'],
            exports: 'jasmine'
        }
//        'jasmine-boot': {
//            deps: ['jasmine', 'jasmine-html'],
//            exports: 'jasmine'
//        }
    }
});

require(['underscore', 'jquery', 'jasmine-html'], function(_, $, jasmine){

    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };
    //--------------------------------------
//    var currentWindowOnload = window.onload;
//    window.onload = function() {
//        if (currentWindowOnload) {
//            currentWindowOnload();
//        }
//
//        document.querySelector('.version').innerHTML = jasmineEnv.versionString();
//        execJasmine();
//    };
//
//    function execJasmine() {
//        jasmineEnv.execute();
//    }
    //---------------------------------------
    var specs = [];

    //specs.push('spec/models/player-test');
    //specs.push('spec/views/text-area-spec');
    //specs.push('spec/models/story-spec');
    specs.push('spec/views/text-area/story-text-area-spec');
//    specs.push('spec/models/story-spec');
//    specs.push('spec/collections/paragraphs-spec');
    specs.push('spec/views/players-spec');
    //specs.push('spec/views/ClearCompletedSpec');
    //specs.push('spec/views/CountViewSpec');
    //specs.push('spec/views/FooterViewSpec');
    //specs.push('spec/views/MarkAllSpec');
    //specs.push('spec/views/NewTaskSpec');
    //specs.push('spec/views/TaskListSpec');
    //specs.push('spec/views/TaskViewSpec');


    $(function(){
        require(specs, function(){
            jasmineEnv.execute();
        });
    });

});