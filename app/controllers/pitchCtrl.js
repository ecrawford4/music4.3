angular.module("myApp")


    .controller("pitchCtrl", function ($scope,$localStorage,$window,$http,
                                       GeneratingInputSetService,InputMapping,ConvertBiologySequence,
                                       Utility,FinalInputMapping,SharedData,
                                       PlayMusic,DownloadMidiFact,DrawChart) {

        //Default values
        $scope.selectedNumVoice = 1;




        var voiceArray = [];
        for(var i = 0; i < $scope.selectedNumVoice ; i++)
        {
            voiceArray.push(
                {
                    selectedSet : "Integers",
                    noteCount : 0,
                    pitchSequence : [],
                    pitchInput : [],
                    pitchInputTemp:[],
                    selectedDurationSet : "",
                    durationSequence : [],
                    durationInput : [],
                    durationInputTemp:[],
                    pitchAlgorithm :"Division",
                    pitchMinRange : 1,
                    pitchMaxRange : 88,
                    pitchMapping: [],
                    durationAlgorithm :"",
                    durationMinRange : 0,
                    durationMaxRange : 6,
                    durationMapping: [],
                    scaleOption :"",
                    keyOptionIndex:"",
                    instrument:"",
                    muted : 0,
                    finalPitchMapping:[]
                }
            );
        }

        //$scope.allVoices = voiceArray;



        if($localStorage.allVoices === undefined){
            //$window.alert("undefined");
            $scope.allVoices = voiceArray;
            $localStorage.allVoices = $scope.allVoices;
        }else{
            $scope.allVoices = $localStorage.allVoices;
            //$window.alert("defined");
        }


        $scope.addVoice = function () {
            $scope.allVoices.push(
                {
                    selectedSet : "",
                    noteCount : 0,
                    pitchSequence : [],
                    pitchInput : [],
                    pitchInputTemp:[],
                    selectedDurationSet : "",
                    durationSequence : [],
                    durationInput : [],
                    durationInputTemp : [],
                    pitchAlgorithm :"",
                    pitchMinRange : 1,
                    pitchMaxRange : 88,
                    pitchMapping: [],
                    durationAlgorithm :"",
                    durationMinRange : 0,
                    durationMaxRange : 6,
                    durationMapping: [],
                    scaleOption :"",
                    keyOptionIndex:"",
                    instrument:"",
                    muted : 0,
                    finalPitchMapping:[]
                }
            );
        }

        $scope.removeVoice = function (index) {

            //$scope.allVoices = $localStorage.allVoices

            // To display confirm box
            /*
            if ($window.confirm("Are you sure to delete voice " + (index+1) + "?") == true) {
                $scope.allVoices.splice(index, 1);
            }
            */
            $scope.allVoices.splice(index, 1);
            //$localStorage.allVoices.splice(index, 1);
        }

        $scope.$watch('allVoices.length', function(newValue, oldValue) {
            $scope.selectedNumVoice = $scope.allVoices.length;
            //$window.alert("changed");
            /*
            for(var i = 0; i < $scope.allVoices.length ; i++)
            {
                var obj = $scope.allVoices[i];
                switch(obj.selectedSet)
                {
                    case "Integers":
                        obj.pitchSetToolTip = "Integers are the set of numbers that include the natural " +
                                        "numbers (0,1,2 ...), combined with the negatives of the natural numbers (0,-1,-2,...).";
                        break;
                    case "Sine":
                        result = getSineSet (noteCount);
                        break;
                    case "Fibonacci":
                        result = getFibonacciSet (noteCount);
                        break;
                    case "Pascal":
                        result = getPascalSet (noteCount);
                        break;
                    case "Powers":
                        result = getPowerSet (noteCount);
                        break;
                    case "Phi":
                        result = getPhiSet (noteCount);
                        break;
                    case "Pi":
                        result = getPiSet (noteCount);
                        break;
                    case "E Constant":
                        obj.pitchSetToolTip = "Known as Euler's number, e is a " +
                                            "mathematical constant constant which represents the base of the natural logarithm function, or 2.718... " +
                                            "This selection will display a decimal expansion of e.";
                        break;
                    case "DNA":
                        result = getDNA (noteCount);
                        break;
                    case "RNA":
                        result = getRNA (noteCount);
                        break;
                    case "Protein":
                        result = getProtein (noteCount);
                        break;
                    case "Custom":
                        result = "Please enter your own set of input...";
                        break;
                }


            }
            */

        });

        $scope.updateNumVoice = function () {

            var allVoicesLength = $scope.allVoices.length;
            var diff = Math.abs($scope.numVoices - allVoicesLength);
            if(allVoicesLength > $scope.numVoices)
            {
                $window.alert("Voices has beed deleted");

                for(var i = 0; i < diff; i++){
                    $scope.allVoices.pop();
                }

            }
            else
            {
                $window.alert("New Voice was added");
                for(var i = 0; i < diff; i++){
                    $scope.addVoice();
                }

            }
        }

/*
        $scope.$watch('numVoices', function(newValue, oldValue) {
            $window.alert("ok");
        });
*/
       $scope.save = function () {
            //$localStorage.allVoices = $scope.allVoices;
        }

        $scope.noteCountChanged = function (index) {
            var obj = $scope.allVoices[index];
            obj.pitchInput = GeneratingInputSetService.getSet(obj.selectedSet,obj.noteCount);
            obj.pitchMapping = InputMapping.getMapping(obj.pitchInput,obj.pitchAlgorithm, obj.pitchMinRange,obj.pitchMaxRange);

        }

        $scope.updateVersion = function (link) {
            //window.location.href = link;
            window.open(link, '_blank');
        }
        $scope.updateInputSet = function (index) {

            var obj = $scope.allVoices[index];
            obj.pitchSequence=[];
            obj.pitchInput = [];
            if(obj.selectedSet === "DNA" || obj.selectedSet === "RNA" || obj.selectedSet === "Protein")
            {
                if(obj.selectedSet === "Protein")
                {
                    $scope.bioType = "";
                }else{
                    $scope.bioType = "singleBases"; //set default value of biotype to "singleBases"
                }

                obj.pitchSequence = GeneratingInputSetService.getSet(obj.selectedSet,obj.noteCount);
            }
            else
            {
                obj.pitchInput = GeneratingInputSetService.getSet(obj.selectedSet,obj.noteCount);
                obj.pitchMapping = InputMapping.getMapping(obj.pitchInput,obj.pitchAlgorithm, obj.pitchMinRange,obj.pitchMaxRange);
            }
        }



        $scope.updatePitchMapping = function (index) 
        {
            var obj = $scope.allVoices[index];
            obj.pitchMapping = InputMapping.getMapping(obj.pitchInput,obj.pitchAlgorithm, obj.pitchMinRange,obj.pitchMaxRange);
            obj.noteCount = obj.pitchMapping.length;

        }

        $scope.scaleOptionsChanged = function (index) {

            var obj = $scope.allVoices[index];
            obj.finalPitchMapping = FinalInputMapping.getFinalPitchMapping(obj.pitchMapping,obj.scaleOption,
                                                                            obj.keyOptionIndex,
                                                                            obj.pitchMinRange,obj.pitchMaxRange);
            //obj.pitchInput = GeneratingInputSetService.getSet(obj.selectedSet,obj.noteCount);

        }
        SharedData.setSharedData($scope.allVoices);


        $scope.convert = function (index,nitrogenBases,bioType) {

            var obj = $scope.allVoices[index];
            //$window.alert(obj.pitchSequence);
            obj.pitchSequence = ConvertBiologySequence.convertInputFormat(obj.pitchSequence);
            obj.pitchInput = ConvertBiologySequence.convert(obj.selectedSet,obj.pitchSequence,
                                                    nitrogenBases,bioType,$scope.proteinValues);//include convertBiologySequence.js
            obj.noteCount = obj.pitchInput.length;
        }


        $scope.convertDuration = function (index,durNitrogenBases,durBioType) {
            var obj = $scope.allVoices[index];
            obj.durationInput = ConvertBiologySequence.convert(obj.selectedDurationSet,obj.durationSequence,
                durNitrogenBases,durBioType,$scope.proteinValues);//include convertBiologySequence.js
            //obj.noteCount = obj.pitchInput.length;
            if(durBioType == "codons")
            {
                if(obj.noteCount > obj.durationInput.length)
                {
                    var str = "Add " + (obj.noteCount - obj.durationInput.length) *3  +" more to sequence";
;                   $window.alert(str);
                }
            }



        }
         $scope.convertDur = function (index,durNitrogenBases,durBioType) {

            var obj = $scope.allVoices[index];
            obj.durationInput = ConvertBiologySequence.convert(obj.selectedDurationSet,obj.durationSequence,
                                                    durNitrogenBases,durBioType,$scope.proteinValues);//include convertBiologySequence.js
            
            if(angular.equals(durBioType, "codons"))
            {
                if(obj.noteCount > obj.durationInput.length)
                {
                    var toAdd = (obj.noteCount - obj.durationInput.length) *3 ; 
                    var displayS = "Add " + toAdd + " more to the sequence.";
                    $window.alert(displayS);
                }
            }

            if(angular.equals(durBioType, "duplicates"))
            {
                if(obj.noteCount != obj.durationInput.length)
                {
                    $window.alert("Input does not have same length as sequence.");
                }
            }
            
            
            //obj.noteCount = obj.pitchInput.length;
        }

        /**** Utility for  Pitch ***/
        $scope.showing=[];
        $scope.showUtilFunc = function(index)
        {
            //var tempArr =inputTemp.slice();
            //$scope.activeParentIndexArr = [];
            var obj = $scope.allVoices[index];
            obj.pitchInputTemp = angular.copy(obj.pitchInput);
            $scope.showing[index] = true;
        }

        $scope.changeInput = function(index,utilFunc)
        {
            var obj = $scope.allVoices[index];
            //obj.pitchInputTemp = utilFunc;
            obj.pitchInputFormatted = Utility.changeInput(utilFunc,obj.pitchInputTemp);

        }

        $scope.changeDurationInput = function(index,utilFunc)
        {
            var obj = $scope.allVoices[index];
            //obj.pitchInputTemp = utilFunc;
            obj.durationInputFormatted = Utility.changeInput(utilFunc,obj.durationInputTemp);

        }

        $scope.discard = function(index)
        {
            var obj = $scope.allVoices[index];

            var r = confirm("Are you sure to discard all the changes?");
            if (r == true) {
                //x = "You pressed OK!";
                obj.pitchInputTemp = obj.pitchInput.slice();
            } else {
                return;
            }
        }


        $scope.dismiss = function(index)
        {
            $scope.showing[index] = false;
        }

        $scope.dismissDuration = function(index)
        {
            $scope.showingDuration[index] = false;
        }

        /**** End Utility for  Pitch ***/
        
        $scope.updateDurationSet = function (index) {
           
            var obj = $scope.allVoices[index];
            obj.durationSequence=[];
            obj.durationInput = [];

            if(obj.selectedDurationSet === "DNA" || obj.selectedDurationSet === "RNA" || obj.selectedDurationSet === "Protein")
            {
                if(obj.selectedDurationSet === "Protein")
                {
                    $scope.bioType = "";
                }else{
                    $scope.bioType = "singleBases"; //set default value of biotype to "singleBases"
                }

                obj.durationSequence = GeneratingInputSetService.getSet(obj.selectedDurationSet,obj.noteCount);
            }
            else
            {
                obj.durationInput = GeneratingInputSetService.getSet(obj.selectedDurationSet,obj.noteCount);
                obj.durationMapping = InputMapping.getMapping(obj.durationInput,obj.durationAlgorithm,
                    obj.durationMinRange,obj.durationMaxRange);
            }


        }

        $scope.updateDurationMapping = function (index) {

            var obj = $scope.allVoices[index];
            obj.durationMapping = InputMapping.getMapping(obj.durationInput,obj.durationAlgorithm, obj.durationMinRange,obj.durationMaxRange);


        }

        $scope.update = function (index,setType) {
            switch (setType) {
                case "pitch":
                    //$window.alert("pitch")
                    break;
                case "duration":
                    //$window.alert("duration")
                    break;
            }

            var obj = $scope.allVoices[index];

            if(obj.selectedSet === "DNA" || obj.selectedSet === "RNA" || obj.selectedSet === "Protein")
            {
                obj.pitchSequence = Utility.convertToArray(obj.pitchSequence);
            }
            else
            {

                obj.pitchInput = Utility.convertToArray(obj.pitchInput);
                obj.pitchInputTemp = obj.pitchInput.slice();
                obj.noteCount = obj.pitchInput.length;
                //obj.pitchMapping = [1,2,3,4];
                obj.pitchMapping = InputMapping.getMapping(obj.pitchInput,obj.pitchAlgorithm,
                                                            obj.pitchMinRange,obj.pitchMaxRange);

            }
        }

        $scope.saveInput = function(index)
        {
            if ($window.confirm("Do you want to save the changes for voice " + (index+1) + "?") == true) {
                var obj = $scope.allVoices[index];
                obj.pitchInput = obj.pitchInputFormatted.slice();
                obj.pitchMapping = InputMapping.getMapping(obj.pitchInput,obj.pitchAlgorithm,
                                                            obj.pitchMinRange,obj.pitchMaxRange);
                obj.noteCount = obj.pitchInput.length;

            }
        }




        /**** Utility for  Duration ***/
        $scope.showingDuration=[];
        $scope.showUtilDurationFunc = function(index)
        {
            var obj = $scope.allVoices[index];
            obj.durationInputTemp = angular.copy(obj.durationInput);
            $scope.showingDuration[index] = true;
        }


        $scope.changeDuration = function(index,utilFunc)
        {
            var obj = $scope.allVoices[index];
            //obj.pitchInputTemp = utilFunc;
            obj.durationInputTemp = Utility.changeInput(utilFunc,obj.durationInputTemp);
        }

        $scope.saveDuration = function(index)
        {
            if ($window.confirm("Do you want to save the changes for voice " + (index+1) + "?") == true) {
                var obj = $scope.allVoices[index];
                obj.durationInput = obj.durationInputFormatted.slice();
                obj.durationMapping = InputMapping.getMapping(obj.durationInput,obj.durationAlgorithm,
                    obj.durationMinRange,obj.durationMaxRange);
            }
        }

        $scope.discardDuration = function(index)
        {
            var obj = $scope.allVoices[index];

            var r = confirm("Are you sure to discard all the changes?");
            if (r == true) {
                //x = "You pressed OK!";
                obj.durationInputTemp = obj.durationInput.slice();
            } else {
                return;
            }
        }


        /**** End Utility for  Duration ***/


        /*Play music */

        $scope.play = function (index,tempo) {
            var obj = $scope.allVoices[index];
            PlayMusic.playMusic(obj.finalPitchMapping,obj.durationMapping,index,obj.instrument,tempo);
        }


        $scope.playAll = function (tempo) {
            var allVoices = $scope.allVoices;
            PlayMusic.playAll(allVoices,tempo);
        }
        /*End Play music */
        $scope.playAll2 = function (tempo) {
            var allVoices = $scope.allVoices;
            PlayMusic.playAll2(allVoices,tempo);
        }
        $scope.pausePlayStop = function (tempo,stop) {
            var allVoices = $scope.allVoices;
            $http({
                method: 'POST',
                url: './php/phpfile.php',
                data: {
                    rawData: DownloadMidiFact.getDownloadData(tempo, allVoices)
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                // code to execute in case of success
                //$window.alert($scope.allVoices[0].finalPitchMapping);
                $scope.loadData = response.data;
                //$window.alert(response.data);
                PlayMusic.pausePlayStop(tempo,stop,response.data);
            }, function (response) {
                // code to execute in case of error
                //$window.alert("failed");
            });

        }

        $scope.pause = function () {
            PlayMusic.pause();
        }
        $scope.resume = function () {
            PlayMusic.resume();
        }


        $scope.login = function() {
            var allVoices = $scope.allVoices;
            $http({
                method: 'POST',
                url: './php/phpfile.php',
                data: {
                    rawData: DownloadMidiFact.getDownloadData(allVoices)
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                // code to execute in case of success
                //$window.alert($scope.allVoices[0].finalPitchMapping);
                $scope.loadData = response.data;
            }, function (response) {
                // code to execute in case of error
                //$window.alert("failed");
            });


        };

        $scope.download = function (tempo) {
            var allVoices = $scope.allVoices;
            //DownloadMidiFact.getDownloadData(allVoices);

            document.forms['download'].notedata.value = DownloadMidiFact.getDownloadData(tempo, allVoices);
            //$window.alert("download unc");
            //$window.alert(document.forms['download'].notedata.value);
            document.forms['download'].submit();
        }

        $scope.resetData = function () {
            $window.alert("Reset");
            $scope.allVoices = [];
            $scope.allVoices.push(
                {
                    selectedSet : "",
                    noteCount : 0,
                    pitchSequence : [],
                    pitchInput : [],
                    pitchInputTemp:[],
                    selectedDurationSet : "",
                    durationInput : [],
                    pitchAlgorithm :"",
                    pitchMinRange : 1,
                    pitchMaxRange : 88,
                    pitchMapping: [],
                    durationAlgorithm :"",
                    durationMinRange : 0,
                    durationMaxRange : 6,
                    durationMapping: [],
                    scaleOption :"",
                    keyOptionIndex:"",
                    instrument:"",
                    muted : 0,
                    finalPitchMapping:[]
                }
            );
            $localStorage.allVoices = $scope.allVoices;

        }

        $scope.tempo = 100;
        $scope.morphPercent = 0;
        $scope.morphPercent1 = 30;

        $scope.getProcessedInput = function (index,check,columnNo,decimalDigits) {
            var obj = $scope.allVoices[index];
            Utility.getProcessedInput(obj.demoInput,check,columnNo,decimalDigits);
        }


        //$scope.regex = '[WFLIMYVCPTASQNGHREDK]{1}(,[WFLIMYVCPTASQNGHREDK]{1})*/';
        //$scope.regex =' ^([WFLIMYVCPTASQNGHREDK]+,?\s*)+$';
        //$scope.regex = /.*/;

        $scope.regex = /^([WFLIMYVCPTASQNGHREDK]{1}\s*,?\s*)+$/i;


        $scope.openKeyboard = function(){
            $window.open('keyboard.html', "Window Name", "height=800,width=480");
        }

        $scope.openRythm = function(){
            $window.open('rythm.html', "Window Name", "height=200,width=900");
        }

        $scope.openProtein = function(){
            $window.open('protein.html', "Window Name", "height=500,width=1200");
        }

        $scope.checkMorph = function(index,morphPercent1)
        {
            var morphValues = [];
            var obj = $scope.allVoices[index];
            if(obj.songMorph == "beethoven")
            {
                morphValues = $scope.beehthovenValues;
            }
            DrawChart.drawChart(index,obj.pitchMapping,obj.morphPercent,obj.songMorph,morphValues);
        }





        $scope.currentIndex = 0;


        $scope.updatedCurrentIndex = function (index) {
            $scope.currentIndex = parseInt(index);
            $scope.songMorph = "";
        }

        $scope.drawCurveTypes =function (index) {
            $scope.afterMorph = [];
            var obj = $scope.allVoices[$scope.currentIndex];
            var pitchMapping = obj.pitchMapping
            console.log("index: "+$scope.currentIndex);
            //$scope.currentIndex = parseInt(index);
            var morphValues = [];
            console.log("morph:" + $scope.songMorph);
            console.log("pitch:" + obj.pitchMapping);
            if($scope.songMorph == "beethoven")
            {
                morphValues = $scope.beehthovenValues;
            }else if($scope.songMorph == "finlandia")
            {
                morphValues = $scope.finlandValues;
            }
            var data = new google.visualization.DataTable();
            data.addColumn('number', 'X');
            data.addColumn('number', 'Voice data');
            data.addColumn('number', $scope.songMorph);
            var mainA=[];


            for(var i = 0; i< pitchMapping.length; i++)
            {
                var arr=[];
                arr.push(i);
                var morphVal = Math.floor((parseInt(morphValues[i]) - parseInt(pitchMapping[i]))*($scope.morphPercent/100)
                                + parseInt(pitchMapping[i]));
                //arr.push((obj.pitchMapping[i]+$scope.currentIndex));
                arr.push(morphVal);
                arr.push(parseInt(morphValues[i]));
                $scope.afterMorph.push(morphVal);
                mainA.push(arr);
            }
            data.addRows(mainA);
            var options = {
                hAxis: {
                    title: ''
                },
                vAxis: {
                    title: ''
                },
                series: {
                    1: {curveType: 'function'}
                }
            };


            var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
            chart.draw(data, options);
        }


        $scope.$watch('morphPercent', function(newValue, oldValue) {
            $scope.drawCurveTypes($scope.currentIndex);
        });

        $scope.applyMorph = function () {
            console.log("morph Applied");
            var obj = $scope.allVoices[$scope.currentIndex];
            obj.finalPitchMapping = $scope.afterMorph.slice();
        }

        $scope.init = function () {

            PlayMusic.createKeyboard();
/*
            var colors = document.getElementById("colors");
            var colorElements = [];
            for (var n = 0; n < 88; n++) {
                var d = document.createElement("div");
                d.style.cssFloat="left";
                d.innerHTML = MIDI.noteToKey[n + 21];
                colorElements.push(d);
                colors.appendChild(d);
            }
*/

        };


        //open pitch utility
        $scope.currentUtility= ""; //current utility = "pitch" / "duration"
        $scope.currentVoiceIndex= -1;
        $scope.openPitchUtility = function (index,input,currentUtility) {
            var obj = $scope.allVoices[index];
            $scope.modalInput = angular.copy(input);
            $scope.modalInputFormatted = [];
            $scope.currentUtility = currentUtility;
            $scope.currentVoiceIndex= index;
        }

        $scope.reverse = function () {
            //var modalInputFormatted = $scope.modalInput.slice();
            //modalInputFormatted =
            //modalInputFormatted = modalInputFormatted.reverse();
            //$window.alert(scope.modalInput);
            //$scope.modalInputFormatted = $scope.modalInput;
        }

        $scope.changeInputModal = function(modalInput,utilFunc)
        {
            //$scope.modalInput = $scope.modalInput.slice();
            //$window.alert(modalInput);
            $scope.modalInputFormatted = Utility.changeInput(utilFunc,modalInput);
        }

        $scope.applyInputModal = function (modalInputFormatted) {
            var obj = $scope.allVoices[$scope.currentVoiceIndex];
            if($scope.currentUtility == "pitch")
            {
                obj.pitchInput = angular.copy(modalInputFormatted);

            }else if ($scope.currentUtility == "duration"){
                obj.durationInput = angular.copy(modalInputFormatted);
            }
        }


        $scope.pitchRangeTooltip = "The purpose of the mapping process (called normalization) is to convert each input number into a pitch within a designated musical range." +
                                    " Here the user can set the desired range for the melody." +
                                    " The default range 1-88 represents the piano range with 88 keys." +
                                   " Zero will represent silence (no pitch)." ;

        $scope.durationRangeTooltip = "The duration mapping destination span is based on ascending rhythmic values represented by 0-9, starting with the sixteenth note and ending with a dotted whole.  In general, low input values convert to short rhythmic durations and high input values convert to long rhythmic durations.  The opposite mapping effect can be obtained in the utilities tools by inverting the input set.\n"

     +" 0= sixteenth note (the smallest rhythmic value)"
      + "  1= dotted sixteeth note (the means add half the value to the duration)"
            + "2= eighth note"
            + "3= dotted eighth note"
            + " 4= quarter note"
            + "5= dotted quartet"
            + " 6= half note"
            + " 7= dotted half note"
            + " 8= whole note"
            + " 9= dotted whole note";

        $scope.eConstantTooltip = "Known as Euler's number, e is a mathematical constant constant which represents the base of the natural logarithm function, or 2.718... "
                                   + "This selection will display a decimal expansion of e.";

        $scope.fibonacciTooltip ="The Fibonacci Sequence is a self generating series of numbers starting with 0 or 1. "
                                    +"Each new number in the series is determined by the sum of the previous pair.";

        $scope.integerTooltip = "Integers are the set of numbers that include the natural numbers (0,1,2 ...), "
                                    +"combined with the negatives of the natural numbers (0,-1,-2,...).";
        $scope.pascalTooltip = "This algorithm uses Pascal's Triangle as a model for generating a series of integers derived from the sums of other integers.";

        $scope.phiTooltip = "Phi is known as the golden ratio. "
                            +"Phi is the ratio of 2 line segments (one large and one small). "
                            +"When the ratio of the two segments is the same as the proportions of the entire line (two segments combined) with its largest segment one finds a perfect ratio expressed 1.618xx. "
                            +"This infinitely long number can be found by taking the square root of 5, adding 1, and then dividing the result by 2. This selection will display a decimal expansion of Phi.";
        $scope.piTooltip = "Pi is known as Archimedes' constant. "
                            +"Pi represents the ratio of a circle's circumference with its diameter. "
                            +"Pi is an infinite constant that is often expressed in the shorter form 3.14 or 22/7. "
                            +"This selection will display a decimal expansion of Pi.";
        $scope.powerTooltip = "The Powers sequence takes each number in the set of integers and raises them to the second power (otherwise known as multiplying a number by itself. e.g. 2^2 = 2*2 = 4";
        $scope.dnaTooltip = "This algorithm converts a DNA sequence into a list of numbers. "
                            +"A DNA sequence is composed of four bases: adenine (A), thymine (T), cytosine (C), and guanine (G). "
                            +"The sequence can only contain the letters A, T, C, and G in either uppercase or lowercase; all non-letter characters will be ignored. "
                            +"Sequences can be found from databanks: http://www.ncbi.nlm.nih.gov/  and http://genome.ucsc.edu/cgi-bin/hgGateway";

        $scope.rnaTooltip = "This algorithm converts a RNA sequence into a list of numbers. "
                            +"A RNA sequence is composed of four bases: adenine (A), uracil (U), cytosine (C), and guanine (G). "
                            +"The sequence can only contain the letters A, U, C, and G in either uppercase or lowercase; all non-letter characters will be ignored. "
                            +"Sequences can be found from databanks: http://www.ncbi.nlm.nih.gov/  and http://genome.ucsc.edu/cgi-bin/hgGateway";

        $scope.proteinTooltip = "This algorithm converts protein chains into a list of numbers.  The default settings are in reference to the Wimley-White whole residue octanol hydrophobicity scale (with averaging). "
                                +"Proteins are made of amino acid residue chains that form organic compounds (from 20 standard amino acids). "
                                +"Sequences can be found from databanks: http://www.ncbi.nlm.nih.gov/";

        $scope.sineTooltip = "The Sine function is a function of an angle, and is commonly used ro model periodic phenomena such as sound and light waves, "
                            +"the position and velocity of harmonic oscillators, sunlight intensity and day length, "
                            +"and average temperature variations throughout the year.";

        $scope.divisionTooltip = "The division operation is a proportionate scaling method that maps (or normalizes) the numeric input values with a relatively even distribution throughout the designated musical range. "
                                +"In a simple example, when the source numbers 1,2,3 (as small, medium, and large values) are mapped to the range 1-88, they would convert to 1, 44, 88. ";

        $scope.logarithmicTooltip = "The logarithmic compression operation is a scaling method that maps input values relative to an inverse exponential curve. "
                                    +"The operation allows wide data spans to compress into smaller musical ranges, or visa versa. "
                                    +"The results will appear distorted with wider distributions of pitches in the bass and tighter distributions at the top of the musical range. "
                                    +"This operation was designed for input sets with large numbers like Pascal's Triangle or the Fibonacci series.";

        $scope.moduloTooltip = "The modulo operation is a scaling method that maps input values within a cyclical pattern throughout the range you choose. "
                                +"In a simple example, when the source numbers 1, 2, 4, are mapped to the 3 note range 61-63, "
                                +"they would convert to 61, 62, 61, as the value 4 has the mod equivalent to 1 in a cyclical counting pattern: 1, 2, 3, 1, 2, 3, 1, 2, 3... (or 61,62,63,61,62,63...). ";
        $scope.initPitch = function () {
            //$window.alert("init");
        }


        //$scope.allVoices[0].pitchSetToolTip = "pitch";



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
