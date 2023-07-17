const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, GroupImage, Membership, Venue, User } = require('../../db/models');
const validateVenue = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('lat')
    .isDecimal()
    .withMessage('Latitude is not valid'),
  check('lng')
    .isDecimal()
    .withMessage('Longitude is not valid'),
  handleValidationErrors
]


//Edit a venue specified by its id
router.put('/:venueId', requireAuth, validateVenue, async (req, res) => {
  const venue = await Venue.findOne({
    where:{
      id: req.params.venueId
    }
  });

  if(venue){
    const group = await Group.findOne({
      where: {
        id: venue.toJSON().groupId
      },
      include: {
        model: Membership
      }
    });
    if(group){
      let confirmed = false;
      let parsed = group.toJSON();
      if(parsed.organizerId === req.user.id)confirmed = true;
      parsed.Memberships.forEach(member => {
        if(member.userId === req.user.id && member.status === 'co-host'){
          confirmed = true;
        }
      });
      if(confirmed){
        venue.set(req.body);
        await venue.save();
        let response = venue.toJSON();
        delete response.createdAt;
        delete response.updatedAt;
        return res.json(response);
      }
      else{
        return res.status(403).json({
          "message": "Forbidden"
        })
      }
    }
  }
  res.statusCode = 404;
  res.json({
    "message": "Venue couldn't be found"
  })

})
module.exports = router;
