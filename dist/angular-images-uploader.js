(function() {
    'use strict';

    angular.module('images.uploader', [
        'angularFileUpload'
    ]);
})();



(function() {
    'use strict';

    angular
        .module('images.uploader')
        .directive('imagesUploader', ImageUploader);

    function ImageUploader() {
        var directive = {
            controller: ImagesUploaderCtrl,
            templateUrl : function(element, attrs) {
                return attrs.templateUrl;
            },
            restrict: 'E',
            scope: {
                images: '=',
                alerts: '='
            }
        };
        
        return directive;
        
        function link(scope, element, attrs) {
        }
    }
    ImagesUploaderCtrl.inject = ['$scope', 'FileUploader'];
    function ImagesUploaderCtrl($scope, FileUploader) {

        $scope.maxImages = 3;

        $scope.uploader = new FileUploader({
            url : "upload.php",
            withCredentials : true
        });  

        $scope.uploader.filters.push({
            name: 'imageFilter',
            fn: function(item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        $scope.uploader.guardUpload = function(){
            var toUpload = 0;
            angular.forEach(this.queue, function(value){
                if (value.isUploading || value.isReady) {
                    toUpload++;
                }
            });

            return (toUpload + $scope.images.length ) < $scope.maxImages; 
        };


         $scope.uploader.onAfterAddingFile = function(fileItem) {
            if ($scope.uploader.guardUpload()) {
                fileItem.upload();
            }  else {
                $scope.uploader.cancelItem(fileItem);
            }    
        };

        $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
            if(response.hasOwnProperty('uploaded') && response.uploaded){
                var image = response.data;
                image.featured = $scope.images.length <= 0;
                $scope.images.push(image);
            }
        };

        $scope.uploader.onErrorItem = function(fileItem, response, status , headers){
            $scope.alerts.push({
                type : 'image-not-uploaded',
                message : "La imagen no se ha podido subir",
                filename : fileItem.file.name
            })
        };


            /** Choice Featured Image */

        $scope.choiceFeatured = function (image) {
            angular.forEach($scope.images, function(value){
                if (value == image) {
                    value.featured = true;
                } else {
                    value.featured = false;
                }
            });
        }
        /** Remove Images */

        $scope.removeImage = function(index){
            $scope.images.splice(index, 1);
        };


    }
})();
'use strict'

angular.module('images.uploader').directive('ngThumb', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }]);