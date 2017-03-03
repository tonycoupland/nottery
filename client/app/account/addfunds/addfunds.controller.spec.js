'use strict';

describe('Component: AddfundsComponent', function () {

  // load the controller's module
  beforeEach(module('notteryApp'));

  var AddfundsComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    AddfundsComponent = $componentController('AddfundsComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
