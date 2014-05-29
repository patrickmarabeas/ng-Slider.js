/* ng-Slider.js v0.0.1
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
  .value( 'config', {

  })

  .directive( 'slider', [ 'config', 'sliderConfig', function( config, sliderConfig ) {
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
        this.decimal = $scope.ngModel.decimal = $attrs.decimal || 0;

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
        angular.extend( config, sliderConfig.config );







      }
    }
  }])

  .directive( 'range', [ function() {
    return {
      require: '^slider',
      scope: true,
      template: '{{ngModel.min}}',
      link: function( scope, element, attrs, ctrl ) {



        scope.$on( 'rangepls', function() {

          var min = (( scope.ngModel.min - ctrl.limits[0] ) / (ctrl.limits[1] - ctrl.limits[0]) * 100);
          var max = (( scope.ngModel.max - ctrl.limits[0] ) / (ctrl.limits[1] - ctrl.limits[0]) * 100);



          element.css({
            'left':  Math.min(Math.max( min, 0), 100) + '%',
            'right': ( 100 -  Math.min(Math.max( max, 0), 100) ) + '%'
          });

        });



      }
    }
  }])

  .directive( 'thumb', [ '$rootScope', function($rootScope) {

    var htmlElement = angular.element(document.body.parentElement);

    return {
      require: '^slider',
      scope: {
        ngModel: '='
      },
      template: '{{ngModel}}',
      link: function( scope, element, attrs, ctrl ) {







        scope.$on( 'render', function() {
          render();
        });



        var render = function( offset ) {

          $rootScope.$broadcast('rangepls');

          var number = ( scope.ngModel - ctrl.limits[0] ) / (ctrl.limits[1] - ctrl.limits[0]) * 100;
          var the_thumb_pos = Math.min(Math.max( number, 0), 100);
          element.css('left', the_thumb_pos + '%');

          if( scope.ngModel > ctrl.limits[1] ) {
            scope.ngModel = ctrl.limits[1];
          }
          else if( scope.ngModel < ctrl.limits[0] ) {
            scope.ngModel = ctrl.limits[0];
          }



        };

        render();












        if ( !ctrl.range ) {
//          ctrl.element.on('mousedown touchstart', function (e) {
//            // clicking on slider itself moves the thumb
//          });
        } else {

//          console.log('yep');

          element.on('mousedown touchstart', function (e) {

//            console.log('down');

            e.preventDefault();
            e.stopPropagation();
            htmlElement.bind( 'mousemove touchmove', _handleMouseEvent );
            return false;
          });
        }
        htmlElement.on('mouseup touchend', function () {

          htmlElement.unbind('mousemove touchmove');
        });


        function _handleMouseEvent(mouseEvent) {

          var track_bb = element.parent()[0].getBoundingClientRect();

          var time = +new Date();
          var trackOrigine = track_bb.left;
          var trackSize = track_bb.width;



          var pos = mouseEvent.clientX;

          var offset = ( pos - element[0].getBoundingClientRect().left );

//console.log(offset);

          var number = ctrl.limits[0] + ((pos - trackOrigine ) / trackSize) * (ctrl.limits[1] - ctrl.limits[0]);

          var the_thumb_pos = Math.min(Math.max(Math.round(
              number * (Math.pow(10, ctrl.decimal))
          ) / (Math.pow(10, ctrl.decimal)), ctrl.limits[0]), ctrl.limits[1]);

          scope.ngModel = the_thumb_pos;
          scope.$apply();
          render( offset );









        }




      }
    }
  }])

  .provider( 'sliderConfig', function() {
    var self = this;
    this.config = {};
    this.$get = function() {
      var extend = {};
      extend.config = self.config;
      return extend;
    };
    return this;
  });