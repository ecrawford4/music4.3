angular.module("myApp")
    .factory('DrawChart', function() {
        var factory = {};
        factory.drawChart = function(index, pitchMapping,morphPercent,songMorph,morphValues) {
            return drawChart(index,pitchMapping,morphPercent,songMorph,morphValues); // include drawChart.js

        }
        return factory;
    })
    .factory('DownloadMidiFact', function() {
        var factory = {};
        factory.getDownloadData = function(tempo, allVoices) {
            return getDownloadData(tempo, allVoices); // include inputMapping

        }
        return factory;
    })
    .factory('SharedData', function() {
        var factory = {};
        return {
            getSharedData:function(){
                return factory;
            },
            setSharedData:function(value){
                factory = value;
            }
        }
        //return factory;
    })

    .factory('GeneratingInputSetService', function() {
        var factory = {};
        factory.getSet = function(setType,noteCount) {
            return generateInputSet(setType,noteCount); // include inputSet.js
        }
        return factory;
    })
    .factory('InputMapping', function() {
        var factory = {};
        factory.getMapping = function(inputSet,algorithm,minRange,maxRange) {
            return getInputMapping(inputSet,algorithm,minRange,maxRange); // include inputMapping
        }
        return factory;
    })
    .factory('ConvertBiologySequence', function() {
        var factory = {};
        factory.convertInputFormat = function (arrayString) {
            return convertInputFormat(arrayString);
        }
        factory.convert = function(selectedSet,arrayString,nitrogenBases,bioType,proteinValues) {
            return convert(selectedSet,arrayString,nitrogenBases,bioType,proteinValues); // include convertBiologySequence.js
        }


        return factory;
    })
    .factory('Utility', function() {
        var factory = {};
        factory.convertToArray= function(arrayString) {
            return convertToArray(arrayString); // include utility.js
        }

        factory.getProcessedInput= function(demoInput,check,columnNo,decimalDigits) {
            return getProcessedInput(demoInput,check,columnNo,decimalDigits); // include utility.js
        }

        factory.changeInput= function(utilFunc, inputTemp) {
            return changeInput(utilFunc, inputTemp); // include utility.js
        }

        factory.reverse= function(pitchInputArr) {
            return reverse(pitchInputArr); // include utility.js
        }
        return factory;
    })
    .factory('FinalInputMapping', function() {
        var factory = {};
        factory.getFinalPitchMapping = function(pitchMapping,scaleOption,keyOptionIndex,pitchMinRange,pitchMaxRange) {
            return getFinalInputMapping(pitchMapping,scaleOption,keyOptionIndex,pitchMinRange,pitchMaxRange); // include finalInputMapping

        }
        return factory;
    })
    .factory('PlayMusic', function() {
        var factory = {};
        /*
         play music use the index for the channel number
         */

        factory.playMusic = function(finalPitchArray,durationMapping,index,instrument,tempo) {
            return playMusic(finalPitchArray,durationMapping,index,instrument,tempo); // include playMusic.js
        }

        factory.playAll = function (allVoices,tempo) {
            return playAll(allVoices,tempo); // include playMusic.js
        }
        factory.playAll2 = function (allVoices,tempo) {
            return playAll2(allVoices,tempo); // include playMusic.js
        }
        factory.pausePlayStop = function (tempo,stop,loadData) {
            return pausePlayStop(tempo,stop,loadData); // include playMusic.js
        }

        factory.pause = function () {
            return pause(); // include playMusic.js
        }
        factory.resume = function () {
            return resume(); // include playMusic.js
        }

        factory.createKeyboard = function () {
            return createKeyboard(); // include playMusic.js
        }
        return factory;
    })
    .controller("myAppCtrl", function ($scope, $http,$window) {
        $scope.instruments = [
            {
                displayName : "Piano", name : "acoustic_grand_piano"
            },
            {
                displayName : "Vibraphone", name : "vibraphone"
            },
            {
                displayName : "Marimba", name : "marimba"
            },
            {
                displayName : "Acoustic Guitar (nylon)", name : "acoustic_guitar_nylon"
            },
            {
                displayName : "Flute", name : "flute"
            },
            {
                displayName :"Synth Drum", name : "synth_drum"
            }
        ];

        $scope.previousVersions = [
            {name : "Previous Version", link : ""},
            {name : "Version 3.2", link : "http://musicalgorithms.org/3.2"},
            {name : "Version 3.1", link : "http://musicalgorithms.org/3.1"},
            {name : "Version 3.0", link : "http://musicalgorithms.org/3.0"},
            {name : "Version 1.0", link : "http://musicalgorithms.ewu.edu/"}
        ];

        $scope.prevLink = $scope.previousVersions[0]; // this line initializes the drop down menu

        $http.get('data/inputSetNames.json').success(function(data) {
            $scope.inputSetNames = data;
        });

        $http.get('data/algorithmNames.json').success(function(data) {
            $scope.algorithmNames = data;
        });

        $http.get('data/durationSetNames.json').success(function(data) {
            $scope.durationSetNames = data;
        });

        $http.get('data/keyNames.json').success(function(data) {
            $scope.keyNames = data;
        });

        $http.get('data/scaleNames.json').success(function(data) {
            $scope.scaleNames = data;
        });

        $http.get('./php/readFile.php').success(function(data) {
            // code to execute in case of success
            var beethovenNotes = data;
            var arr=[];
            for(var i = 0; i < beethovenNotes.length; i++)
            {
                var strToAdd = beethovenNotes[i];
                //console.log(strToAdd);
                var trim = strToAdd.toString().replace(/^\s+|\s+$/g, '');
                //str += ","+trim;
                arr.push(trim.trim());
            }
            $scope.beehthovenValues = arr;
        });

        $http.get('./php/readFinlandia.php').success(function(data) {
            // code to execute in case of success
            var finNotes = data;
            var arr=[];
            for(var i = 0; i < finNotes.length; i++)
            {
                var strToAdd = finNotes[i];
                //console.log(strToAdd);
                var trim = strToAdd.toString().replace(/^\s+|\s+$/g, '');
                //str += ","+trim;
                arr.push(trim.trim());
            }
            $scope.finlandValues = arr;
        });

        $scope.numVoicesArr = [1,2,3,4];
        $scope.numVoices = 1;


        $window.onload = function () {
            //MIDI.Player.loadFile("demo.mid");
            //MIDI.Player.start();
            //load soundfont
            var instrumentList = [];
            for (var i in $scope.instruments) {
                instrumentList.push($scope.instruments[i].name);
            }
            //window.alert(instrumentList);
            MIDI.loader = new sketch.ui.Timer;
            MIDI.loadPlugin({

                soundfontUrl: "./soundfont/",
                //instrument: "acoustic_grand_piano",
                instruments: instrumentList,
                //instrument: "acoustic_guitar_nylon",
                //instrument: "synth_drum",
                onprogress: function(state, progress) {
                    MIDI.loader.setValue(progress * 100);
                }
            });


        };

        /*
        $scope.createLightKeyboard = function () {
            var colors = document.getElementById("colors");
            var colorElements = [];
            for (var n = 0; n < 88; n++) {
                var d = document.createElement("div");
                d.style.cssFloat="left";
                d.innerHTML = MIDI.noteToKey[n + 21];
                colorElements.push(d);
                colors.appendChild(d);
            }

        }
*/

    }).directive('toggle', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            if (attrs.toggle=="tooltip"){
                $(element).tooltip();
            }
            if (attrs.toggle=="popover"){
                $(element).popover();
            }
        }
    };
})