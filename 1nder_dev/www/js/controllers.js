angular.module('starter')

.controller("AppCtrl",function($scope,$state,$ionicHistory){
	// assign global function for action goBack
	$scope.myGoBack = function() {
    	$ionicHistory.goBack();
  	};
})
.controller("MainCtrl",function($scope,$state){
	//openning sign in
	$scope.openSignin = function(){
		$state.go('sign-in')
	}

})
.controller("SignupCtrl",function($scope,$state,$rootScope,$firebaseArray,$dbConnect){
	// creating account user
	$scope.CreateAccount = function(){
		$rootScope.email = this.signup.email;	// email
		var password = this.signup.password; // password
		//$rootScope.email = "test@test.com";	// email
		//var password = "test"; // password

		$dbConnect.createUser({email:$rootScope.email , password:password},function(error,userData){
			if(error){
				switch(erro.code){
					case"EMAIL_TAKEN":
					console.log("The new user account cannot be created because the email is already in use.");
					break;
					case"INVALID_EMAIL":
					console.log("The specified email is not a valid email.");
					break;
					default:
			        console.log("Error creating user:", error);
			    }
			}
			else{
					console.log("Successfully created user account with uid:", userData.uid);
					// storing auth id
					$rootScope.userID = userData.uid;
					//go to other page
					$state.go("add-register")
				}
		})
	};
	$scope.addInfo = function(){
		//referindg data of the register forms
		var name = this.signup.name;
		var lastname = this.signup.lastname;
		var nickname = this.signup.nick;
		var birthday = this.signup.birthday;
		// creating query into database Firebase
		var userRef = $dbConnect.child("users/" + $rootScope.userID);
		// inserting data users into database
		userRef.set({
			profile:{
				uid:$rootScope.userID,
				name:name,
				lastname:lastname,
				birthday:birthday,
				nickname:nickname,
				email: $rootScope.email,
				about:"",
				date_created: Firebase.ServerValue.TIMESTAMP,
			},
			following:{},
			followers:{},
			status:{}
		})
		// go to other page
		$state.go("main");

/*
Rack test
var UserRef = ref.child("users");
var newUserRef = UserRef.set({
	profile:{

			name:"name",
			lastname:"lastname",
			birthday:"birthday",
			nickname:"nickname",
			email: "$rootScope.email",

	}
});
*/
	}
})

.controller("SigninCtrl",function($scope,$state,$dbConnect,$localStorage){

	//openning sign up
	$scope.openSignup = function(){
		$state.go('sign-up');
	}

/*
Rack test
	var email = "test@test.com";
	var password = "test";
*/
	$scope.AuthAccount = function(){
	//var email = this.signin.email;
	//var password = this.signin.password;
	var email = "test@test.com";
	var password = "test";
		$dbConnect.authWithPassword({"email":email,"password":password},function(error,authData){
			if(error){
				console.log("Login Failed!", error);
			}else{
				 console.log("Authenticated successfully with payload:",authData);
				 // local parameters assign with a variable
				 var userID = authData.uid;
				 $localStorage.set("params",userID);
				 // go to other page
				 $state.go("dashboard.feed",{uid:userID});
			}
		})
	}
})

.controller('DashCtrl',function($scope,$state,$rootScope,$ionicSideMenuDelegate,$dbConnect,$cordovaCamera){
	// taking url id parameters
	var userID = $dbConnect.getAuth().uid;
	console.log(userID);
	var query =  $dbConnect.child("users/"+ userID + "/profile/");
	// query the profile data
	query.once('value',function(dataProfiles){
		$scope.profile = dataProfiles.val();
		var profile = $scope.profile;
	})
	// open side menu
	$scope.toggleMenu = function(){
		$ionicSideMenuDelegate.toggleLeft();
	};

	$scope.tabFirst = function(){
		$state.go("dashboard.feed",{uid:userID});
	}
	$scope.tabSecond = function(){
		$state.go("dashboard.world",{uid:userID});
	}

	$scope.tabThird = function(){
		$state.go("dashboard.me",{uid:userID});
	}
	// open Profile
	$scope.openProfile = function (){
		$state.go("myProfile",{uid:userID});
	};

	// openning Camera
	$scope.openCamera = function() {
		var options = {
					quality: 100,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: Camera.PictureSourceType.CAMERA,
					allowEdit: false,
					encodingType: Camera.EncodingType.JPEG,
					targetWidth: 650,
					targetHeight: 450,
					popoverOptions: CameraPopoverOptions,
					saveToPhotoAlbum: false,
					correctOrientation : true
			};

			$cordovaCamera.getPicture(options).then(function(imageData) {
					$rootScope.srcImage = "data:image/jpeg;base64," + imageData;
			}, function(err) {
					// error
			});
			$state.go("publish",{uid:userID});
		}

})
.controller('ProfileCtrl',function($scope,$state,$firebaseArray,$dbConnect,$localStorage){
	// storage the userID into localStorage
	var userID = $localStorage.get("params");
	// connecting with databse
	var query =  $dbConnect.child("users/"+ userID + "/profile/");
	// query the profile data
	query.once('value',function(dataProfiles){
		$scope.profile = dataProfiles.val();
		var profile = $scope.profile;
	})
	$scope.goEdit = function(){
		$state.go("editProfile",{uid:userID});
	}
	// statistics
	var statistics =  $dbConnect.child("users/"+ userID);
	statistics.once("value", function(stats) {

		$scope.following = stats.child("following").numChildren();
		$scope.followers = stats.child("followers").numChildren();

	});
	// developing editProfile
	$scope.myEdit = function(){

		var name = this.profile.name;
		var lastname = this.profile.lastname;
		var nickname= this.profile.nickname;
		var birthday = this.profile.birthday;
		var about = this.profile.about;
		query.update({
			name:name,
			lastname:lastname,
			nickname:nickname,
			birthday:birthday,
			about:about,
			date_last_update:Firebase.ServerValue.TIMESTAMP,
		})
		$state.go("myProfile",{uid:userID});
	}
})
.controller("WorldCtrl",function($scope,$state,$dbConnect,$localStorage,$location){
	// storage the userID into localStorage
	var userID = $localStorage.get("params");
	// connecting with databse
	var query =  $dbConnect.child("pictures/");
	query.on('value',function(dataUsers){
		$scope.users = dataUsers.val();
	});
	$scope.redirect = function(usersid){
		$state.go("usersPosts",{uid:usersid})
	}
})
.controller("myPostCtrl",function($scope,$state,$dbConnect,$localStorage){
	// storage the userID into localStorage
	var userID = $localStorage.get("params");
	// connecting with database
	var query =  $dbConnect.child("users/"+ userID +"/profile/");
	// query the profile data
	query.once('value',function(dataProfiles){
		$scope.profile = dataProfiles.val();
		var profile = $scope.profile;
	})
	// query images
	var query_images = $dbConnect.child("pictures/");
	query_images.orderByChild("uid").equalTo(userID).once('value',function(dataimages){
		$scope.pictures = dataimages.val();

	});
	// comments
	var comments = $dbConnect.child("users/"+ userID + "/comments")
	// viewing comments
	comments.once('value',function(comments){
			$scope.allcomments = comments.val()
	})
})
.controller("FeedCtrl",function($scope,$state,$dbConnect,$localStorage,queryFollow,$firebaseArray,$rootScope){

	var primaryID = $localStorage.get("params");
	// connecting with database
	var query_following =  $dbConnect.child("users/"+ primaryID +"/following/");
	var query_feedData = $dbConnect.child("pictures/");
	// find following
	query_following.once("child_added",function(fwing) {
			query_feedData.orderByChild("uid").equalTo(fwing.val().fwing_uid).once('value',function(dataimages){
					$scope.users  = dataimages.val();
			})
	});
	$scope.redirect = function(usersid){
		$state.go("usersPosts",{uid:usersid})
	}
})
.controller("usersPostCtrl",function($scope,$rootScope,$state,$dbConnect,$localStorage,$window,queryFollow){

	//getting parameters id
	var usersparam = $state.params;
	//storage into local storage
	$localStorage.set("userparams", usersparam.uid)
	// storage the userID into localStorage
	var foreignID = $localStorage.get("userparams");
	// getting auth id
	var primaryID = $localStorage.get("params");
	// connecting with database
	var query =  $dbConnect.child("users/"+ foreignID +"/profile/");
	// query the profile data
	query.once('value',function(dataProfiles){
		$scope.profile = dataProfiles.val();
	})
	//button follow
	var response = queryFollow.findfollow(primaryID,foreignID);
	var button_txt= null;
	var css = null;
  $scope.isBeingFollowed = response;
	$scope.follow = function () {
		queryFollow.addfollow(primaryID,foreignID);
		$scope.isBeingFollowed = true;
	};
	$scope.unFollow = function () {
		queryFollow.removefollow(primaryID,foreignID);
		$scope.isBeingFollowed = false;
	};

	//comments
	var comments_user = $dbConnect.child("users/"+ primaryID + "/profile/")
	comments_user.once('value',function(dataProfiles){
		$scope.comments_profile = dataProfiles.val();
		$rootScope.avatar = $scope.comments_profile.avatar;
		$rootScope.nickname = $scope.comments_profile.nickname;
	})
	// view and insert comments
	var comments = $dbConnect.child("users/"+ foreignID + "/comments")
	// viewing comments
	comments.once('value',function(comments){
			$scope.allcomments = comments.val()
	})
	// inserting comments into profile of users
	$scope.sendcomment = function(){
		var comment = this.send.comment;
		comments.push({
				uid:primaryID,
				comment:comment,
				avatar:$rootScope.avatar,
				nickname:$rootScope.nickname,
		})
		// clear field
		this.send.comment = '';
	}
})

.controller('PublishCtrl',function($scope,$rootScope,$state,$dbConnect,$localStorage,$ionicHistory){

	//getting parameters id
	var primaryID = $localStorage.get("params");
	var query =  $dbConnect.child("users/"+ primaryID +"/profile/");
	query.once('value',function(params){
				$rootScope.userparams = params.val();
	})
	// publishing picture
	$scope.publish = function(){
		var description = this.publish.description;
		var picture = $rootScope.srcImage;
		var addPicture = $dbConnect.child("pictures/");
		addPicture.push({
			uid:primaryID,
			avatar:$rootScope.userparams.avatar,
			nickname:$rootScope.userparams.nickname,
			description:description,
			image:picture,
			date_posted:Firebase.ServerValue.TIMESTAMP
		})

		$ionicHistory.goBack()
	}
})
