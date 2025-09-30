angular.module("myApp")

    .controller("playCtrl", function($scope, PlayMusic, $localStorage, SharedData) {
    if ($localStorage.allVoices === undefined) {
        $scope.allVoices = SharedData.getSharedData();
        $localStorage.allVoices = $scope.allVoices;
    } else {
        $scope.allVoices = $localStorage.allVoices;
    }

    $scope.pitchDisplay = "";

    $scope.updatePitchDisplay = function(pitch) {
        $scope.pitchDisplay += " " + pitch;
    };

    $scope.clearPitchDisplay = function() {
        $scope.pitchDisplay = "";
    };

    $scope.playAll = function(tempo) {
    PlayMusic.playAll($scope.allVoices, tempo, $scope);
    };

    $scope.pausePlayback = function() {
        PlayMusic.pausePlayback();
    };

    $scope.resumePlayback = function() {
        PlayMusic.resumePlayback($scope.allVoices, $scope);
    };

    $scope.stopPlayback = function() {
        PlayMusic.stopPlayback($scope);
    };
    
});
