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
        function jsonPretty(str){
            try{
                obj = JSON.parse(str);
                return JSON.stringify(obj, null, 4);
            }catch(e){
                return "";
            }
        }
        
        $scope.copyToClipboard = function(){
            elem = $(".result>pre");
            var textArea = document.createElement("textarea");
            // Place in top-left corner of screen regardless of scroll position.
            textArea.style.position = 'fixed';
            textArea.style.top = 0;
            textArea.style.left = 0;

            // Ensure it has a small width and height. Setting to 1px / 1em
            // doesn't work as this gives a negative w/h on some browsers.
            textArea.style.width = '2em';
            textArea.style.height = '2em';

            // We don't need padding, reducing the size if it does flash render.
            textArea.style.padding = 0;

            // Clean up any borders.
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';

            // Avoid flash of white box if rendered for any reason.
            textArea.style.background = 'transparent';


            textArea.value = elem.text();
            document.body.appendChild(textArea);
            textArea.select();

            try {
              var successful = document.execCommand('copy');
              var msg = successful ? 'successful' : 'unsuccessful';
              console.log('Copying text command was ' + msg);
            } catch (err) {
              console.log('Oops, unable to copy');
            }

            document.body.removeChild(textArea);
            
        };
        $scope.encode = function(text){return b64EncodeUnicode(text)};
        $scope.decode = function(text){return b64DecodeUnicode(text)};
        $scope.combine = function(text){
            json = jsonPretty(text);
            if(json != ""){return json}
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


