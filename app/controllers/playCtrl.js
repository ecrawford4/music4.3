angular.module("myApp")

    .controller("playCtrl",function ($scope,$window, $localStorage, PlayMusic, SharedData) {




        if($localStorage.allVoices === undefined){
            //$window.alert("undefined");
            $scope.allVoices = SharedData.getSharedData();
            $localStorage.allVoices = $scope.allVoices;
        }else{
            $scope.allVoices = $localStorage.allVoices;
            //$window.alert("defined");
        }

        $scope.play = function (index) {
            var obj = $scope.allVoices[index];
            PlayMusic.playMusic(obj.finalPitchMapping,obj.durationMapping,index,obj.instrument);
        }


        $scope.playAll = function (tempo) {
            var allVoices = $scope.allVoices;
            PlayMusic.playAll(allVoices,tempo);
        }


        //$scope.allVoices = SharedData.getSharedData();
        /*
        $scope.playAll = function (tempo) {
            var allVoices = $scope.allVoices;
            PlayMusic.playAll(allVoices,tempo);
        }
        */
    });