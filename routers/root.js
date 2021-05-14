/**
 * The root router
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

/**
 * Controllers
 */

router.get('/', (req, res) => {
    return res
        .status(200)
        .json({
            date: res.locals.moment()
        })
});

/**
 * Export the router
 */
module.exports = router;
