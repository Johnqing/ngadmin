let AS = window.AS = angular.module('myApp', ['vapour']);

AS.run(($rootScope)=>{
    $rootScope.$on("$stateChangeStart", (e, toState, toParams, fromState, fromParams) => {
        console.log('[toState]', toState);
        $rootScope.currentControl = toState.name;
    });
});

AS.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('index', {
        url: '/index',
        controller: 'IndexCtrl',
        template: require('./template/index.html')
    });

    $urlRouterProvider.otherwise('/index');
});