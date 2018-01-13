angular.module("myApp")
    .controller("durationCtrl", function ($scope) {

        $scope.updateDurationSet = function (index) {

            var obj = $scope.allVoices[index];
            obj.durationInput = GeneratingInputSetService.getSet(obj.selectedDurationSet,obj.noteCount);
            //$scope.durationOutputSet = GeneratingInputSetService.getSet($scope.selectedDurationSet,$scope.noteCount);


        }

    });


