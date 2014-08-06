angular.module('BootstrapApp', ['SharedGhApp', 'ui.bootstrap'])
  .controller('ModalCtrl', ['$scope', '$attrs', '$modal', function($scope, $attrs, $modal) {
    var repo = $scope.$eval($attrs.repo);

    this.show = function() {
      var modalScope = $scope.$new();
      modalScope.repo = repo;
      var modalInstance = $modal.open({
        templateUrl: './modal.html',
        controller: 'ModalInstanceCtrl',
        scope: modalScope
      });
    };
  }])

  .controller('ModalInstanceCtrl', function() {

  })
