'use strict';

var app = require('../..');
import request from 'supertest';

var newTransaction;

describe('Transaction API:', function() {

  describe('GET /api/transactions', function() {
    var transactions;

    beforeEach(function(done) {
      request(app)
        .get('/api/transactions')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          transactions = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      transactions.should.be.instanceOf(Array);
    });

  });

});
