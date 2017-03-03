'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var gamebetCtrlStub = {
  index: 'gamebetCtrl.index',
  show: 'gamebetCtrl.show',
  create: 'gamebetCtrl.create',
  update: 'gamebetCtrl.update',
  destroy: 'gamebetCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var gamebetIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './gamebet.controller': gamebetCtrlStub
});

describe('Gamebet API Router:', function() {

  it('should return an express router instance', function() {
    gamebetIndex.should.equal(routerStub);
  });

  describe('GET /api/gamebets', function() {

    it('should route to gamebet.controller.index', function() {
      routerStub.get
        .withArgs('/', 'gamebetCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/gamebets/:id', function() {

    it('should route to gamebet.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'gamebetCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/gamebets', function() {

    it('should route to gamebet.controller.create', function() {
      routerStub.post
        .withArgs('/', 'gamebetCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/gamebets/:id', function() {

    it('should route to gamebet.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'gamebetCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/gamebets/:id', function() {

    it('should route to gamebet.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'gamebetCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/gamebets/:id', function() {

    it('should route to gamebet.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'gamebetCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
