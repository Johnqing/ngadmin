window.AS.directive('asHeader', () => {
    return {
        template: require('./index.html'),
        controller: ($scope)=> {
            $scope.logout = ()=> {
                alert('退出');
            }
        }
    }
});