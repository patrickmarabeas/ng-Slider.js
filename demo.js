var demo = angular.module( 'demo', ['ngSlider'] );

demo.controller('demoController', [ '$scope', function( $scope ) {
  $scope.slider = {};
//  $scope.slider.decimal = 1;
  $scope.slider.data = [1,3,4,7,9,10,11,13,14,17,18];

  $scope.slider2 = {};
  $scope.slider2.data = [5,10];

  $scope.slider3 = {};
  $scope.slider3.data = [0,100];

  $scope.changeData = function() {
    $scope.slider.data = [3,7];
  };

  $scope.changeData2 = function() {
    $scope.slider.data = [-100,100];
  };

  $scope.changeData3 = function() {
    $scope.slider.data = [1,9];
  };

  $scope.changeData4 = function() {
    $scope.slider.data = [1,40];
  };

}]);