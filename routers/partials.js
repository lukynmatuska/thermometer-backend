/**
 * The partials methods for routers
 * @author Lukas Matuska (lukynmatuska@gmail.com)
 * @version 1.0
 * @see https://lukasmatuska.cz/
 */

/**
 * Express router API
 */
const router = require('express').Router();

/**
 * Libs
 */
const moment = require('../libs/moment');

/**
 * Controllers
 */

module.exports.setLocalVariables = (req, res, next) => {
  res.locals = {
    currentPath: req.originalUrl,
    moment
  };
  next();
};
router.all('*', this.setLocalVariables);

module.exports.onlyLoggedIn = (req, res, next) => {
  if (req.session.user != undefined) {
    return next();
  } else {
    return res
      .status(403)
      .json({
        status: 'error',
        error: 'please-login'
      });
  }
};

module.exports.onlyNonLoggedIn = (req, res, next) => {
  if (req.session.user === undefined) {
    return next();
  }
  return res
    .status(200)
    .json({
      status: 'error',
      error: 'only-for-non-logged-in'
    });
};

module.exports.onlyAdmin = (req, res, next) => {
  if (req.session.user == undefined) {
    return res
      .status(403)
      .json({
        status: 'error',
        error: 'only-admin'
      });
  } else if (req.session.user.type === 'admin') {
    next();
  } else {
    return res
      .status(403)
      .json({
        status: 'error',
        error: 'only-admin'
      });
  }
};

/**
 * Export the router
 */
module.exports.router = router;
