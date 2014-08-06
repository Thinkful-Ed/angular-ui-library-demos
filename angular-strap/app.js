angular.module('AngularStrapApp', ['SharedGhApp', 'mgcrea.ngStrap'])

  .config(['$sceProvider', function($sceProvider) {
    $sceProvider.enabled(false);
  }])

  .controller('TabsCtrl', ['$scope', '$attrs', function($scope, $attrs) {
    var repo = $scope.$eval($attrs.repo);

    this.activeTab = 0;

    this.tabs = [
      { title : "README", template: "/README-tab.html" },
      { title : "Issues", template: "/issues-tab.html" },
      { title : "Commits", template: "/commits-tab.html" }
    ];
  }])

  .controller('ModalCtrl', ['$scope', '$attrs', '$modal', function($scope, $attrs, $modal) {
    var repo = $scope.$eval($attrs.repo);

    this.show = function() {
      var modalScope = $scope.$new();
      modalScope.repo = repo;
      var modalInstance = $modal({
        scope: modalScope,
        controller: 'ModalInstanceCtrl',
        template: './modal.html',
        show: true
      });
    };
  }])

  .controller('ModalInstanceCtrl', function() {

  })
