/*global angular:false */
/*jshint trailing:false */

'use strict';

angular.module('todo', ['ionic', 'ngRoute'])

.config(function ($compileProvider){
  // Needed for phonegap routing
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.config(function($routeProvider, $locationProvider) {

  $routeProvider.when('/', {
    templateUrl: 'views/default.html',
    controller: 'TodoCtrl'
  });

  $routeProvider.when('/video/:videoId', {
    templateUrl: 'views/video.html',
    controller: 'VideoCtrl'
  });

  $routeProvider.otherwise({
    redirectTo: '/'
  });

})

/**
 * The Projects factory handles saving and loading projects
 * from local storage, and also lets us save and load the
 * last active project index.
 */
.factory('Projects', function() {
  return {
    all: function() {
      var projectString = window.localStorage.projects;
      if(projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },
    save: function(projects) {
      window.localStorage.projects = angular.toJson(projects);
    },
    newProject: function(projectTitle) {
      // Add a new project
      return {
        title: projectTitle,
        tasks: []
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage.lastActiveProject, 10) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage.lastActiveProject = index;
    }
  };
})

.controller('VideoCtrl', function($scope) {
  $scope.width = window.innerWidth;
  $scope.height = window.innerHeight;
  
  $scope.init = function() {
    window.setInterval(function() {
      angular.element('#coverPane').css('z-index', 100);
      console.log("cover!");
      window.setTimeout(function() {
        angular.element('#coverPane').css('z-index', -1);
        console.log("uncover");
      }, 500);
    }, 5000);
  };
  
  $scope.init();
})

.controller('TodoCtrl', function($scope, $timeout, Modal, Projects) {

  // A utility function for creating a new project
  // with the given projectTitle
  var createProject = function(projectTitle) {
    var newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length-1);
  };


  // Load or initialize projects
  $scope.projects = Projects.all();

  // Grab the last active, or the first project
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

  // Called to create a new project
  $scope.newProject = function() {
    var projectTitle = prompt('Project name');
    if(projectTitle) {
      createProject(projectTitle);
    }
  };

  // Called to select the given project
  $scope.selectProject = function(project, index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $scope.sideMenuController.close();
  };

  // Create our modal
  Modal.fromTemplateUrl('views/new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope
  });

  $scope.createTask = function(task) {
    if(!$scope.activeProject) {
      return;
    }
    $scope.activeProject.tasks.push({
      title: task.title
    });
    $scope.taskModal.hide();

    // Inefficient, but save all the projects
    Projects.save($scope.projects);

    task.title = "";
  };

  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  $scope.toggleProjects = function() {
    $scope.sideMenuController.toggleLeft();
  };

});
