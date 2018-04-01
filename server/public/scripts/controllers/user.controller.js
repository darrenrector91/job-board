myApp.controller('UserController', ['UserService', function (UserService) {
  // console.log('UserController created');
  var self = this;
  self.userService = UserService;
  self.userObject = UserService.userObject;
  self.status = {
    list: []
  };
  self.getStatus = UserService.getStatus;
  self.items = UserService.items;
  // self.getJobs = UserService.getJobs;
  self.items = {
    list: []
  };

  console.log(self.items);

  self.getJobs = function() {
    UserService.getJobs();
  };

  // uploading files using filestack
  self.openPicker = function (document) {
    UserService.openPicker(document);
  };

  self.document = function (items) {
    UserService.document(items);
  };

  // Service to add item
  self.addJob = function (data) {
    UserService.addJob(data);
    console.log(data);
    self.job = '';
  };
}]);