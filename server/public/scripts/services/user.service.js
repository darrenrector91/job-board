myApp.service('UserService', ['$http', '$location', '$mdDialog', function ($http, $location, $mdDialog) {
  console.log('UserService Loaded');
  var self = this;
  self.userObject = {};
  var fsClient = filestack.init('AXWNQAQuJSmq8G5Dp0gIDz');

  self.document = {list: []};
  self.getStatusName = {list: []}
  self.items = {list: []};
  self.jobs = {list: []};

  


  self.getuser = function () {
      // console.log('UserService -- getuser');
      $http.get('/api/user').then(function (response) {
        if (response.data.username) {
          // user has a curret session on the server
          self.userObject.userName = response.data.username;
          self.getJobs();
          // console.log('UserService -- getuser -- User Data: ', self.userObject.userName);
        } else {
          console.log('UserService -- getuser -- failure');
          // user has no session, bounce them back to the login page
          $location.path("/home");
        }
      }, function (response) {
        console.log('UserService -- getuser -- failure: ', response);
        $location.path("/home");
      });
    }

    self.logout = function () {
      console.log('UserService -- logout');
      $http.get('/api/user/logout').then(function (response) {
        console.log('UserService -- logout -- logged out');
        $location.path("/home");
      });
    }

  self.document = function (items, ev) {
    $mdDialog.show({
      controller: EditPostingModalController,
      controllerAs: 'vm',
      templateUrl: '../views/templates/edit-posting-modal.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      mapURL: '',
      clickOutsideToClose: true,
      resolve: {
        item: function () {
          return items;
        }
      }
    })
  }

  function EditPostingModalController($mdDialog, item, UserService) {
    const self = this;
    self.items = item;
    console.log(self.items);

    self.closeModal = function () {
      self.hide();
    }
  }

  self.openPicker = function openPicker(document) {
    fsClient.pick({
        fromSources: ["local_file_system"],
        accept: [".doc", ".docx", ".docm", ".pdf", "text/plain"]
      })
      .then(function (response) {
        self.document.list = response.filesUploaded;
        console.log('response from filestack', self.document.list);
        self.getDocumentURL(self.document.list);
      });
  }

  self.getDocumentURL = function (response) {
    // loop to get filestack image url 
    for (let i = 0; i < response.length; i++) {
      documentURL = response[i].url;
    }
    console.log('document URL:', documentURL);
    self.document.list = documentURL;
    console.log(self.document.list);
  }

  // Send item list to server
  self.addJob = function (data) {
    // console.log('in addJob service:', self.document.list);
    data.document_url = self.document.list;
    console.log('service adding job data', data);
    return $http.post('/api/user/addJob', data)
      .then(function (response) {
        // swal("Form data and image were successfully added to the table!")
        console.log(data);
        // self.getJobs();
      })
      .catch(function (err) {
        console.log('error on post request - adding item');
      })
  } //end add item

  // getting status for status dropdown
  self.getStatus = function () {
    return $http.get('/api/user/getStatusName')
      .then(function (response) {
        self.getStatusName.list = response.data;
        return response.data
      })
      .catch(function (response) {
        console.log('error on get request', response);
      });
  } //end getting table data

  // getting table data for user view table from jobs table in database
  self.getJobs = function () {
    return $http.get('/api/user/jobs')
      .then(function (response) {
        console.log('get jobs response: ', response);
        self.jobs.list = response.data;
      })
      .catch(function (error) {
        console.log('error on get request:', error);
      });
  } //end getting table data


  
}]);