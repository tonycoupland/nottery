'use strict';

var express = require('express');
var controller = require('./game.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', controller.checkgamestates(), controller.index);
router.get('/active', controller.checkgamestates(), controller.active);
router.get('/:id', controller.show);
router.put('/:id', auth.hasRole('admin'), controller.update);

module.exports = router;
