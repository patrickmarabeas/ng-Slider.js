/* ng-Slider.js v1.0.0
 * https://github.com/patrickmarabeas/ng-Slider.js
 *
 * Copyright 2014, Patrick Marabeas http://marabeas.io
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 * Date: 30/05/2014
 */

'use strict';

angular.module( 'ngSlider', [] )

  .directive( 'slider', [ function() {
    return {
      restrict: 'A',
      controller: [ '$scope', '$element', '$attrs', function( $scope, $element, $attrs ) {
        var _this = this;
        var minValue = Math.min.apply( null, $scope.ngModel.data );
        var maxValue = Math.max.apply( null, $scope.ngModel.data );

        this.min = $scope.ngModel.min = minValue;
        this.max = $scope.ngModel.max = maxValue;
        this.limits = [minValue, maxValue];
        this.range = $scope.ngModel.range = $attrs.slider === 'range';
        this.decimal = $scope.ngModel.decimal = $attrs.decimal || $scope.ngModel.decimal || 0;

        $scope.$watch( function() { return $scope.ngModel.data; }, function( newVal ) {
          _this.limits = [ Math.min.apply(null, newVal), Math.max.apply(null, newVal) ];
          $scope.$broadcast('render');
        });
      }],
      scope: {
        ngModel: '='
      },
      template: function( element, attrs ) {
        return '' +
          '<div data-range data-ng-if="ngModel.range"></div>' +
          '<div data-thumb data-ng-model="ngModel.min"></div>' +
          '<div data-thumb data-ng-model="ngModel.max" data-ng-if="ngModel.range"></div>';
      },
      link: function( scope, element, attrs ) {

      }
    }
  }])

  .directive( 'range', [ function() {
    return {
      require: '^slider',
      scope: true,
      template: '{{ngModel.min}}',
      link: function( scope, element, attrs, ctrl ) {

        scope.$on( 'update range', function() {

          // Range based upon percentage
          var min = Math.min( Math.max(( scope.ngModel.min - ctrl.limits[0] ) / ( ctrl.limits[1] - ctrl.limits[0] ) * 100, 0), 100);
          var max = Math.min( Math.max(( scope.ngModel.max - ctrl.limits[0] ) / ( ctrl.limits[1] - ctrl.limits[0] ) * 100, 0), 100);

          element.css({
            'left':  min + '%',
            'right': ( 100 - max ) + '%'
          });

        });

      }
    }
  }])

  .directive( 'thumb', [ '$rootScope', '$document', function($rootScope, $document) {



    return {
      require: '^slider',
      scope: {
        ngModel: '='
      },
      template: '{{ngModel}}',
      link: function( scope, element, attrs, ctrl ) {

        if ( !ctrl.range ) {




//          ctrl.element.on('mousedown touchstart', function ( mouseEvent ) {
//            // clicking on slider itself moves the thumb
//          });




        } else {

          element.on('mousedown touchstart', function ( mouseEvent ) {

            mouseEvent.preventDefault();
            mouseEvent.stopPropagation();
            $document.bind( 'mousemove touchmove', function( mouseEvent ) {

              var currentMin = scope.$parent.ngModel.min;
              var currentMax = scope.$parent.ngModel.max;
              var parentElmBB = element.parent()[0].getBoundingClientRect();
              // Translate cursor position value into position within data set
              var thumbPos = ctrl.limits[0] + (( mouseEvent.clientX - parentElmBB.left ) / parentElmBB.width ) * ( ctrl.limits[1] - ctrl.limits[0] );

              scope.$apply( function() {

                scope.ngModel = ( attrs.ngModel === 'ngModel.min' )
                  // MIN THUMB: Limit range of movement to lower limit and the current max thumb
                  ? Math.min( Math.max( Math.round( thumbPos * ( Math.pow( 10, ctrl.decimal ))) / ( Math.pow( 10, ctrl.decimal)), ctrl.limits[0] ), currentMax )
                  // MAX THUMB: Limit range of movement to upper limit and the current min thumb
                  : Math.min( Math.max( Math.round( thumbPos * ( Math.pow( 10, ctrl.decimal ))) / ( Math.pow( 10, ctrl.decimal)), currentMin ), ctrl.limits[1] );

                scope.render();

              });
            });

            return false;
          });


          ( scope.render = function() {

            var thumbPos = Math.min(Math.max(( scope.ngModel - ctrl.limits[0] ) / ( ctrl.limits[1] - ctrl.limits[0] ) * 100, 0 ), 100);
            element.css('left', thumbPos + '%');

            // Keep the min and max within a smaller range than selected on data set change
            if( scope.ngModel > ctrl.limits[1] ) scope.ngModel = ctrl.limits[1];
            if( scope.ngModel < ctrl.limits[0] ) scope.ngModel = ctrl.limits[0];

            // Make the min thumb accessible when under the max thumb at max range
            element.toggleClass('maxed', attrs.ngModel === 'ngModel.min' && scope.ngModel == ctrl.limits[1] );
            $rootScope.$broadcast('update range');
          })();

          scope.$on( 'render', function() {
            scope.render();
          });

        }

        $document.on('mouseup touchend', function () {
          $document.unbind('mousemove touchmove');
        });

      }
    }
  }]);