myApp.controller('UserController', ['UserService', function (UserService) {
  console.log('UserController created');
  var self = this;
  self.userService = UserService;
  self.userObject = UserService.userObject;

  // uploading files using filestack
  self.openPicker = function (document) {
    UserService.openPicker(document);
  };

  // finding body of water on map
  self.document = function (items) {
    // const API = 'AIzaSyBm4aUk3dBt6BGPOdW3eqCB6njJPTH-f6s';
    UserService.document(items);
  };
}]);