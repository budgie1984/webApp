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
      		controller: 'HomeCtrl'
    		})
          .otherwise({
            redirectTo: '/phones'
          });
      }]);

 
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

phonesApp.service('UserService',  function($rootScope){
  var users = [{ 
    firstname :     'brian',
    lastname :      'burroughs',
    username :      'boggyb',
    emailaddress :  'budgie1984@gmail.com',
    password :      'admin',
  }] || [];

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

  this.logIn = function(username,password){  
   users.forEach(function(user){
   if(user.username == username && user.password == password){
      currentUser = user;
   };
   });
  };

})


   phonesApp.controller('PhoneListCtrl', 
        ['$scope', 'PhoneService',
          function($scope, PhoneService) {
             PhoneService.getPhones().success(function(data) {
                   $scope.phones = data
                 })
             $scope.orderProp = 'age';
          }])

   phonesApp.controller('HomeCtrl', 
        ['$scope', 'PhoneService','UserService',
          function($scope, PhoneService, UserService) {
            var phones =[]
             PhoneService.getPhones().success(function(data) {
                   $scope.phones = data
                   data.forEach(function(data){
                      var phone =  new Phone(data)
                      phones.push(phone);
                   })
                   $scope.currentUser = UserService.getCurrentUser()

             $scope.addToCart = function($event){
              phones.forEach(function(phone){
                var id = $event.target.id
                if (phone.id == id ){
                  $scope.currentUser.addToCart(phone)
                }
              })

             }
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
      }]);
      

phonesApp.controller('RegisterCtrl', 
  function ($scope, $location, UserService, $rootScope) {
   $scope.register = function(){
    UserService.register($scope.user);
    $location.path('/login'); 	
}
});

phonesApp.controller('LoginCtrl', 
  function ($scope, $location, UserService) {
  $scope.logIn = {};
   $scope.logIn = function(){
   	UserService.logIn($scope.logIn.username, $scope.logIn.password)
   	$location.path('/home'); 	
}
});


var User = function(userInfo){
  this.firstname = userInfo.firstname;
  this.lastname = userInfo.lastname;
  this.username = userInfo.username;
  this.emailaddress = userInfo.emailaddress;
  this.password = userInfo.password;
  this.cartTotal = 0;
  this.phoneCart = []

  this.addToCart = function(phone){
    this.cartTotal = this.cartTotal + phone.price;
    this.phoneCart.push(phone)
  }
};

var Phone = function(phoneData){
  this.price = phoneData.price || 200;
  this.id = phoneData.id;
}