const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, GroupImage, Membership, Venue, User, EventImage, Attendance, Event } = require('../../db/models');

router.delete('/:imageId', requireAuth, async (req,res) => {
  const img = await EventImage.findOne({
    where: {
      id: req.params.imageId
    }
  });
  if(!img){
    return res.status(404).json({
      "message": "Event Image couldn't be found"
    });
  }
  const event = await Event.findOne({
    where: {
      id: img.toJSON().eventId
    }
  })
  if(!event){
    return res.status(404).json({
      "message": "Event couldn't be found"
    })
  }
  const group = await Group.findOne({
    where: {
      id: event.toJSON().groupId
    },
    include: [
      {
        model: Membership
      }
    ]
  });
  let confirmed = false;
  let parsed = group.toJSON();
  if(parsed.organizerId === req.user.id) confirmed = true;
  parsed.Memberships.forEach(member => {
    if(member.userId === req.user.id && member.status === 'co-host'){
      confirmed = true;
    }
  });

  if(confirmed){
    await img.destroy();
    return res.json({
      "message": "Successfully deleted"
    });
  }
  else{
    return res.status(403).json({
      "message": "Unauthorirzed to perform this operation"
    })
  }
})

module.exports = router;
