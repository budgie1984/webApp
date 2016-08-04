    var phonesApp = angular.module('phoneCatApp', ['ngRoute']);

    phonesApp.config(['$routeProvider',
      function($routeProvider) {
        $routeProvider
          .when('/phones', {
            templateUrl: 'partials/phone-list.html',
            controller: 'PhoneListCtrl'
          })
	    .when('/phones/:phoneId', {
            templateUrl: 'partials/phone-detail.html',
            controller: 'PhoneDetailCtrl'
          })
    		.when('/register', {
     	 	templateUrl: 'partials/register.html',
     		 controller: 'RegisterCtrl'
   	 	})
   		 .when('/login', {
      		templateUrl: 'partials/login.html',
      		controller: 'LoginCtrl'
    		})
 		.when('/home', {
      		templateUrl: 'partials/home.html',
      		controller: 'PhoneListCtrl'
    		})
          .otherwise({
            redirectTo: '/phones'
          });
      }]);

    phonesApp.controller('PhoneListCtrl', 
        ['$scope', 'PhoneService',
          function($scope, PhoneService) {
             PhoneService.getPhones().success(function(data) {
                   $scope.phones = data
                 })
             $scope.orderProp = 'age';
          }])

   phonesApp.controller('PhoneDetailCtrl', 
         ['$scope', '$location', '$routeParams', 'PhoneService', 
         function($scope, $location, $routeParams, PhoneService) {
             PhoneService.getPhone($routeParams.phoneId)
                .success(function(data) {
                   $scope.phone = data
                   $scope.img = $scope.phone.images[0]
                   })
                .error(function(err) {
                    $location.path('./pnones') 
                  })
             $scope.setImage = function(img) {
                  $scope.img = img
               }
      }])
		  
     phonesApp.factory('PhoneService', ['$http' , function($http){
            var api = {
                getPhones : function() {
                    return $http.get('phones/phones.json')            
                }, 
                getPhone : function(id) {  // NEW
                     return $http.get('phones/' + id + '.json')
                }
            }
            return api
        }])

phonesApp.service('UserService', ['$http' , function ($http){
  var users = [{ 
    firstname :     'brian',
    lastname :      'burroughs',
    username :      'boggyb',
    emailaddress :  'budgie1984@gmail.com',
    password :      'admin',
  }];

 var currentUser = null;

  this.getUsers = function () {
    return users;
     
  };

  this.getCurrentUser = function () {
    return currentUser;
  };

  this.register = function(userInfo) {
    var user = new User(userInfo);
    users.push(user);
  };

  this.login = function(username,password){  
   users.forEach(function(user){
   if(user.username == username && user.password == password){
     currentUser = user;
   };
   });
  };//end function

}]);


phonesApp.controller('RegisterCtrl', 
  function ($scope, $location, UserService) {
   $scope.register = function(){
    UserService.register($scope.user);
    $location.path('/login');
  }
});


phonesApp.controller('LoginCtrl', 
  function ($scope, $location, UserService) {

   $scope.logIn = function(){
     UserService.login($scope.user.username,$scope.user.password);
     $location.path('/home');
  }
});

phonesApp.controller('HomeCtrl', 
  function ($scope, $location, UserService, PhoneService) {
   $scope.currentUser = UserService.getCurrentUser();
	PhoneService.getPhones()

});


var User = function(userInfo){
  this.firstname = userInfo.firstname;
  this.lastname = userInfo.lastname;
  this.username = userInfo.username;
  this.emailaddress = userInfo.emailaddress;
  this.password = userInfo.password;
};



phonesApp.service('ReviewService', ['$http' , function ($http){
  // var reviews = [{ 
  //  	 stars :     '1',
  //    review:     'excellent',
  //  	 email :     'boggyb',

  // }];


  this.getReviews = function () {
    return reviews;
     
  };

}]);





phonesApp.controller("ReviewController", function($scope, ReviewService){
this.review = {};
this.addReview = function(product) {
phones.reviews.push(this.review);
};
});
