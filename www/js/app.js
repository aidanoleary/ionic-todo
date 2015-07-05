// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

angular.module('todo', ['ionic'])

.factory('Projects', function() {
    return {
        all: function() {
            var projectString = window.localStorage['projects'];
            if(projectString) {
                return angular.fromJson(projectString);
            }
            return[];
        },
        save: function(projects) {
            window.localStorage['projects'] = angular.toJson(projects);
        },
        newProject: function(projectTitle) {
            return {
                title: projectTitle,
                tasks: []
            };
        },
        getLastActiveIndex: function() {
            return parseInt(window.localStorage['lastActiveProject']) || 0;
        },
        setLastActiveIndex: function (index) {
            window.localStorage['lastActiveProject'] = index;
        }
    }



})

.controller('TodoCtrl', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate) {


        // ===========
        // Projects
        // ===========

        // Create our projects modal
        $ionicModal.fromTemplateUrl('new-project.html', function(modal) {
            $scope.projectModal = modal;
        }, {
            scope: $scope
        });

        //Show the new project modal
        $scope.newProject = function() {
            $scope.projectModal.show();
        }

        //Hide the new project modal
        $scope.closeNewProject = function() {
            $scope.projectModal.hide();
        }

        // Create the new project
        $scope.createProject = function(project) {
            /*
            $scope.projects.push({
                title: project.title
            });
            */
            var newProject = Projects.newProject(project.title);
            $scope.projects.push(newProject);
            Projects.save($scope.projects);
            $scope.selectProject(newProject, $scope.projects.length-1);
            $scope.projectModal.hide();
            project.title = "";
        }

        //A utility function for creating a new project
        /*
        var createProject = function(projectTitle) {
            var newProject = Projects.newProject(projectTitle);
            $scope.projects.push(newProject);
            Projects.save($scope.projects);
            $scope.selectProject(newProject, $scope.projects.length-1);
        }
        */

        // Load or initialise projects
        $scope.projects = Projects.all();

        // Grab the last active or first project
        $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

        // Called to create a new project
        /*
        $scope.newProject = function() {
            var projectTitle = prompt('project name');
            if(projectTitle) {
                createProject(projectTitle);
            }
        };
        */

        // Delete a project
        $scope.deleteProject = function(project) {
            $scope.projects.splice($scope.projects.indexOf(project), 1);
            Projects.save($scope.projects);
        }

        // Called to select the given project
        $scope.selectProject = function(project, index) {
            $scope.activeProject = project;
            Projects.setLastActiveIndex(index);
            $ionicSideMenuDelegate.toggleLeft(false);
        };

        // =============
        // Tasks
        // =============

        // Create our tasks modal
        $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
            $scope.taskModal = modal;
        }, {
            scope: $scope
        });

        $scope.createTask = function(task) {
            if(!$scope.activeProject || !task) {
                return;
            }
            $scope.activeProject.tasks.push({
                title: task.title
            });
            $scope.taskModal.hide();

            Projects.save($scope.projects);

            task.title = "";
        }

        $scope.deleteTask = function(task) {
            $scope.activeProject.tasks.splice($scope.activeProject.tasks.indexOf(task), 1);

            Projects.save($scope.projects);
        }

        $scope.newTask = function() {
            $scope.taskModal.show();
        }

        $scope.closeNewTask = function() {
            $scope.taskModal.hide();
        }

        $scope.toggleProjects = function() {
            $ionicSideMenuDelegate.toggleLeft();
        }

        $timeout(function() {
            if($scope.projects.length == 0) {
                $scope.newProject();
                /*
                while(true) {

                    var projectTitle = prompt('Your first project title:');

                    if(projectTitle) {
                        $scope.createProject({
                            title: projectTitle
                        });
                        break;
                    }
                }
                */
            }
        })

});
