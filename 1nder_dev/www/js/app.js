// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module("starter", ["ionic","firebase","ngCordova","ionic-material", "ionMdInput","ngMaterial","ngMessages"])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  $ionicConfigProvider.tabs.position('bottom'); //bottom
  $ionicConfigProvider.navBar.alignTitle('center');

  $stateProvider
    .state('main',{
      url: "/",
      templateUrl:"templates/main.html",
      controller:"MainCtrl"
    })
    .state('sign-up',{

      url:"/signup" ,
      templateUrl:"templates/signup.html",
      controller:"SignupCtrl"

    })
    .state('add-register',{
      url: "/addregister",
      templateUrl: "templates/addregister.html",
      controller:"SignupCtrl"

    })
    .state('sign-in',{

      url: "/signin",
      templateUrl: "templates/signin.html",
      controller:"SigninCtrl"

    })
    .state('myProfile',{
      url:"/profile/:uid",
      templateUrl:"templates/profile.html",
      controller:"ProfileCtrl"

    })
    .state('editProfile',{

        url:"/profile/edit/:uid",
        templateUrl:"templates/editProfile.html",
        controller:"ProfileCtrl"
    })
    .state('usersPosts',{
      url:"/usersPosts/:uid",
      templateUrl:"templates/userpost.html",
      controller:"usersPostCtrl"
    })
    .state('publish',{
      url:"/publish/:uid",
      templateUrl:"templates/publish.html",
      controller:"PublishCtrl"
    })
    .state('dashboard',{
      url:"/dash",
      abstract: true,
      templateUrl: "templates/dashboard.html",
      controller:"DashCtrl"
    })
    .state('dashboard.feed', {
    url: "/myFeed/:uid",
    views: {
      'tab-feed': {
        templateUrl: "templates/feed.html",
        controller:"FeedCtrl"
      }
    }
  })
  .state('dashboard.world', {
    url: "/worldPosts/:uid",
    views: {
      'tab-world': {
        templateUrl: "templates/world.html",
        controller:"WorldCtrl"
      }
    }
  })
  .state('dashboard.me', {
    url: "/myPost/:uid",
    views: {
      'tab-me': {
        templateUrl: "templates/me.html",
        controller:"myPostCtrl"
      }
    }
  });


  $urlRouterProvider.otherwise('/');

})
