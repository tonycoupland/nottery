'use strict';

var app = require('../..');
import request from 'supertest';

var newGamebet;

describe('Gamebet API:', function() {

  describe('GET /api/gamebets', function() {
    var gamebets;

    beforeEach(function(done) {
      request(app)
        .get('/api/gamebets')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          gamebets = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      gamebets.should.be.instanceOf(Array);
    });

  });

});
