angular.module('gh', ['base64'])

  .value('ghHost', 'https://api.github.com/')

  .value('ghAuth', 'client_id=ab9b0c9fb30bd2f252e1&client_secret=cbe95f66c4641110dafefba69c25114f9c38d10b')

  .factory('ghRequest', function($http, $rootScope, $q, ghHost, ghAuth) {
    return function(path) {
      var defer = $q.defer();
      var q = path.indexOf('?') == -1 ? '?' : '&';
      $http.get(ghHost + path + q + ghAuth, { cache : true, }).success(function(response) {
          if (/API rate limit exceeded/.test(response.message)) {
            $rootScope.$broadcast('ghRateLimitExceeded');
            defer.reject();
          } else {
            defer.resolve(response.data ? response.data : response);
          }
        }, function() {
          $rootScope.$broadcast('ghRateLimitExceeded');
          defer.reject();
        });

      return defer.promise;
    }
  })

  .factory('ghRepoCommits', function(ghRequest) {
    return function(owner, repo) {
      return ghRequest('repos/' + owner + '/' + repo + '/commits');
    };
  })

  .factory('ghRepoPullRequests', function(ghRequest) {
    return function(owner, repo) {
      return ghRequest('repos/' + owner + '/' + repo + '/pulls');
    };
  })

  .factory('ghRepoIssues', function(ghRequest) {
    return function(owner, repo) {
      return ghRequest('repos/' + owner + '/' + repo + '/issues');
    };
  })

  .factory('ghRepoReadme', function(ghRequest, base64Decode) {
    return function(owner, repo) {
      return ghRequest('repos/' + owner + '/' + repo + '/readme').then(function(data) {
        return base64Decode(data.content);
      });
    };
  })

  .factory('ghRepos', function(ghRequest) {
    return function(search) {
      search = search ? search : '';
      return ghRequest('search/repositories?q=' + search).then(function(data) {
        return data.items;
      });
    };
  })

  .factory('ghRepo', function(ghRequest) {
    return function(owner, repo) {
      return ghRequest('repos/' + owner + '/' + repo);
    };
  })

  .factory('ghGists', function(ghRequest) {
    return function(search) {
      return ghRequest('gists/public?q=' + (search || ''));
    };
  })

  .factory('ghGist', function(ghRequest) {
    return function(id) {
      return ghRequest('gists/' + id);
    };
  })

  .factory('ghRepoCollaborators', function(ghRequest) {
    return function(owner, repo) {
      return ghRequest('repos/' + owner + '/' + repo + '/collaborators');
    };
  })

  .factory('ghUsers', function(ghRequest) {
    return function(search) {
      return ghRequest('users?q=' + (search || ''));
    };
  });
