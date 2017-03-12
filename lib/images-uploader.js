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