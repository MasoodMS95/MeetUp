const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, GroupImage } = require('../../db/models');

router.get('/', async (req, res) => {
  const data = await Group.findAll({
    include:
    {
      model: GroupImage, //attributes: ['url']
    }
  });

  const formattedResponse = {};
  formattedResponse.Groups = data;
  res.json(formattedResponse);
})

module.exports = router;
