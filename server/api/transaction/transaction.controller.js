/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/transactions              ->  index
 * POST    /api/transactions              ->  create
 * GET     /api/transactions/:id          ->  show
 * PUT     /api/transactions/:id          ->  update
 * DELETE  /api/transactions/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Transaction from './transaction.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Transactions for this user
export function index(req, res) {

  // Get usersID for authenticated session
  var userId = req.user._id;

  return Transaction.find({"usersId":userId}).sort('-timestamp').exec()
    .then(transactions => {
        res.status(200).json(transactions);
      })
    .catch(handleError(res));
}
