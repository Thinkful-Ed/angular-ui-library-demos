angular.module('SharedGhApp', ['gh', 'ngRoute'])

  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    

    $routeProvider.when('/', {
      templateUrl : '../shared/empty.html',
      controller : 'EmptyCtrl'
    });

    $routeProvider.when('/repo/:owner/:repo', {
      templateUrl : './repo_template.html',
      controller : 'RepoCtrl as repo',
      resolve : {
        repo : ['ghRepo', '$route', function(ghRepo, $route) {
          return ghRepo($route.current.params.owner, $route.current.params.repo);
        }]
      }
    });
  }])

  .directive('appMenu', function() {
    return {
      templateUrl : '../shared/menu.html'
    }
  })

  .run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeStart', function() {
      $rootScope.ready = false;
    });

    $rootScope.$on('appLoading', function() {
      $rootScope.ready = false;
    });

    $rootScope.$on('appReady', function() {
      $rootScope.ready = true;
    });
  }])

  .directive('delay', ['$timeout', function($timeout) {
    return function($scope, element, attrs) {
      element.on('input', function() {
        throttle(function() {
          $scope.$eval(attrs.delay);
        });
      });

      var timer;
      function throttle(fn) {
        timer && $timeout.cancel(timer);
        timer = $timeout(fn, 500);
      }
    }
  }])

  .controller('AppCtrl', ['$scope', 'ghRepos', function($scope, ghRepos) {

    var ctrl = this;

    $scope.$watch(function() {
      return ctrl.searchTerm;
    }, function(q) {
      q = q || 'Angular';
      $scope.$emit('appLoading');
      ghRepos(q).then(function(repos) {
        $scope.$emit('appReady');
        ctrl.repos = repos;
      });
    });

    ctrl.searchTerm = 'Angular';
  }])

  .controller('EmptyCtrl', ['$scope', function($scope) {

  }])

  .controller('RepoCtrl', ['$scope', 'repo', 'ghRepoCollaborators', 'ghRepoReadme', 'ghRepoIssues', 'ghRepoCommits', '$q',
                   function($scope,   repo,   ghRepoCollaborators,   ghRepoReadme,   ghRepoIssues,   ghRepoCommits, $q) {

    var ctrl = this;
    var owner = repo.owner.login;
    var name = repo.name; 

    this.details = repo;

    this.title = owner + '/' + name;
    
    var requests = [];

    requests.push(ghRepoCollaborators(owner, name).then(function(results) {
      ctrl.collabs = results;
    }));

    requests.push(ghRepoReadme(owner, name).then(function(readme) {
      ctrl.readme = readme;
    }));

    requests.push(ghRepoIssues(owner, name).then(function(issues) {
      ctrl.issues = issues;
    }));

    requests.push(ghRepoCommits(owner, name).then(function(commits) {
      ctrl.commits = commits;
    }));

    $q.all(requests).then(function() {
      $scope.$emit('appReady');
    });
  }])

  .controller('ModalCtrl', function() {

  })
