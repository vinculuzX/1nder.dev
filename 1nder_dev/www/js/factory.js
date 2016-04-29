angular.module('starter')

.factory('$localStorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.factory("Auth", function($firebaseAuth) {

  var usersRef = new Firebase("https://app-ionic-1103.firebaseio.com/users/");

  return $firebaseAuth(usersRef);

})

.factory("$dbConnect",function(){

	var connectUrl = new Firebase("https://app-ionic-1103.firebaseio.com/");

	if (connectUrl == null){

		console.log("Not possible connect this database!!!!");

	}else{

		console.log("The connection was stablish  " + connectUrl);

		return connectUrl ;
	}

})

.factory('queryFollow',["$dbConnect","$rootScope",function($dbConnect,$rootScope){

  return{

    findfollow:function(primary,foreign){
      // find following user
      var path_following = $dbConnect.child("users/" + primary + "/following/")
      path_following.orderByChild("fwing_uid").equalTo(foreign).once("child_added",function(find){
              $rootScope.result = find.exists();
      })

      return $rootScope.result
    },
    addfollow:function(primary,foreign){
      // add following users
      var path_primary = $dbConnect.child("users/" + primary + "/following/");
      path_primary.push().set({fwing_uid:foreign});
      // add followers users
      var path_foreign = $dbConnect.child("users/" + foreign + "/followers/")
      path_foreign.push().set({fwers_uid:primary});
    },

    removefollow:function(primary,foreign){
      // deleting following users
      var path_primary = $dbConnect.child("users/" + primary + "/following/");
      path_primary.orderByChild("fwing_uid").equalTo(foreign).once("child_added",function(fwing) {
            $rootScope.fwing_key = fwing.key();
      });
      path_primary.child($rootScope.fwing_key).remove();
      // deleting followers users
      var path_foreign = $dbConnect.child("users/" + foreign + "/followers/")
      path_foreign.orderByChild("fwers_uid").equalTo(primary).once("child_added",function(fwers) {
            $rootScope.fwers_key = fwers.key();
      });
      path_foreign.child($rootScope.fwers_key).remove();
    },

  }
}])
