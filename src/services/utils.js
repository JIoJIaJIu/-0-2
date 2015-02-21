(function (undefined) {
'use strict';

angular.module('MomAndPop.services').service('utils', function () {
    this.pathJoin = function () {
        var url = '';
        _.forEach(arguments, function (str) {
            if(str.substr(-1) == '/') {
                str = str.substr(0, str.length - 1);
            }

            if (url)
                url += '/';

            url += str;
        });
        return url;
    };
});

})();
