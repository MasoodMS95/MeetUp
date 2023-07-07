const router = require('express').Router();
const { setTokenCookie, restoreUser, requireAuth  } = require('../../utils/auth.js');
const { User } = require('../../db/models');

router.use(restoreUser);

router.get(
  '/restore-user',
  (req, res) => {
    return res.json(req.user);
  }
);

  router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });


module.exports = router;
