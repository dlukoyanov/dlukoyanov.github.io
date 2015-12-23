var app = angular.module('app', []);
app.controller('base64Controller', [
    '$scope',
    function($scope) {
    	function b64EncodeUnicode(str) {
    		return (!str || 0 === str.length)?"":btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {return String.fromCharCode('0x' + p1);}));
		}
        function b64DecodeUnicode(str) {
            return (!str || 0 === str.length)?"":decodeURIComponent(escape(atob(str)));
        }
		function b64DecodeUnicodeSafe(str) {
			try{
				return b64DecodeUnicode(str);
			}catch(e){
				return "";
			}
		}

   		$scope.encode = function(text){return b64EncodeUnicode(text)};
		$scope.decode = function(text){return b64DecodeUnicode(text)};
        $scope.combine = function(text){
            try{
                return formatXml(b64DecodeUnicode(text));
            }catch(e){
                return b64EncodeUnicode(text);
            }
        }

        function formatXml(xml) {
            var formatted = '';
            var reg = /(>)(<)(\/*)/g;
            xml = xml.replace(reg, '$1\r\n$2$3');
            var pad = 0;
            jQuery.each(xml.split('\r\n'), function(index, node) {
                var indent = 0;
                if (node.match( /.+<\/\w[^>]*>$/ )) {
                    indent = 0;
                } else if (node.match( /^<\/\w/ )) {
                if (pad != 0) {
                    pad -= 1;
                }
                } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
                    indent = 1;
                } else {
                    indent = 0;
                }

                var padding = '';
                for (var i = 0; i < pad; i++) {
                    padding += '  ';
                }

                formatted += padding + node + '\r\n';
                console.log(formatted);
                pad += indent;
            });

            return formatted;
        }
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


