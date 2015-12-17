var app = angular.module('app', []);
app.controller('base64Controller', [
    '$scope',
    function($scope) {
    	function b64EncodeUnicode(str) {
    		return (!str || 0 === str.length)?"":btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {return String.fromCharCode('0x' + p1);}));
		}
		function b64DecodeUnicode(str) {
			try{
				return (!str || 0 === str.length)?"":decodeURIComponent(escape(atob(str)));
			}catch(e){
				return "";
			}
		}

   		$scope.encode = function(text){return b64EncodeUnicode(text)};
		$scope.decode = function(text){return b64DecodeUnicode(text)};
}]
);
app.directive('elastic', [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, element) {
                $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                var resize = function() {
                    element[0].style.height = $scope.initialHeight;
                    element[0].style.height = "" + element[0].scrollHeight + "px";
                };
                element.on("input change", resize);
                $timeout(resize, 0);
            }
        };
    }
]);



