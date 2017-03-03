'use strict';

describe('Component: AccountComponent', function () {

  // load the controller's module
  beforeEach(module('notteryApp'));

  var AccountComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    AccountComponent = $componentController('AccountComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
