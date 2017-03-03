'use strict';

import {Router} from 'express';
//var express = require('express');
import * as controller from './transaction.controller';
//var controller = require('./transaction.controller');
import * as auth from '../../auth/auth.service';

var router = new Router();
//var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index); // Can only get which is restricted to authenticated user

module.exports = router;
