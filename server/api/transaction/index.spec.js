'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var transactionCtrlStub = {
  index: 'transactionCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var transactionIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './transaction.controller': transactionCtrlStub
});

describe('Transaction API Router:', function() {

  it('should return an express router instance', function() {
    transactionIndex.should.equal(routerStub);
  });

  describe('GET /api/transactions', function() {

    it('should route to transaction.controller.index', function() {
      routerStub.get
        .withArgs('/', 'transactionCtrl.index')
        .should.have.been.calledOnce;
    });

  });

});
