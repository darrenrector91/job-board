myApp.controller('UserController', ['UserService', function (UserService) {
  // console.log('UserController created');
  var self = this;
  self.userService = UserService;
  self.userObject = UserService.userObject;
  self.items = UserService.items;
  self.status = {
    list: []
  };

  // uploading files using filestack
  self.openPicker = function (document) {
    UserService.openPicker(document);
  };

  self.document = function (items) {
    UserService.document(items);
  };

  // GET Status on page load
  self.getStatus = function () {
    UserService.getStatus();
  };
}]);