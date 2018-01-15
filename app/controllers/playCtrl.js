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
    });