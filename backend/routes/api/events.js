const express = require('express')
const router = express.Router();
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Group, GroupImage, Membership, Venue, User, Event, EventImage, Attendance } = require('../../db/models');

const validateEvent = [
  check('venueId')
    .custom(async (venueId, { req }) => {
      const venue = await Venue.findOne({
        where: {
          id: venueId
        }
      });
      if(venue){
        return true;
      }
      throw new Error('Venue does not exist');
    }),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
  check('type')
    .isIn(['Online', 'In person'])
    .withMessage("Type must be Online or In person"),
  check('capacity')
    .isNumeric()
    .withMessage("Capacity must be an integer"),
  check('price')
    .isDecimal()
    .custom(async (price, { req }) => {
      if(price > 0){
        return true;
      }
      throw new Error("Price is invalid");
    })
    .withMessage("Price is invalid"),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check('startDate')
    .custom(async (startDate, { req }) => {
      let currDate = new Date();
      let enteredDate = new Date(startDate);
      if(enteredDate < currDate){
        throw new Error("Start date must be in the future");
      }
      return true;
    }),
  check('endDate')
    .custom(async (endDate, { req }) => {
      let startDate = new Date(req.body.startDate);
      let end = new Date(endDate);
      if(startDate >= end){
        throw new Error("End date is less than start date");
      }
      return true;
    }),
  handleValidationErrors];

//get all events
router.get('/', async (req, res) => {
  const events = await Event.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'capacity', 'price', 'description']
    },
    include:[
    {
      model: EventImage,
      where: {
        preview: true
      },
      limit: 1
    },
    {
      model: Attendance
    },
    {
      model: Venue,
      attributes: ['id', 'city', 'state']
    },
  ]});

  //Populate EventList
  const eventList = [];
  events.forEach(event => {
    eventList.push(event.toJSON());
  })

  for(let event of eventList){
    // Set group
    let group = await Group.findOne({
      where: {
        id: event.groupId
      },
      attributes: ['id', 'name', 'city', 'state']
    })
    event.Group = group.toJSON();

    //Set numAttending

    // let numAttending = 0;
    // event.Attendances.forEach(person => {
    //   if(person.status === 'attending') numAttending++;
    // })
    event.numAttending = await Attendance.count({
      where: {
        status: 'attending',
        eventId: event.id
      }
    });
    delete event.Attendances;
    if(event.EventImages.length > 0){
      event.previewImage = event.EventImages[0].url;
    }
    else{
      event.previewImage = null;
    }
    delete event.EventImages;
  }
  let responseObj = {};
  responseObj.Events = eventList;
  res.json(responseObj);
});

//Get details of an Event specified by its id
router.get('/:eventId', async (req, res) => {
  const event = await Event.findOne({
    where:{
      id: req.params.eventId
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    },
    include:[
    {
      model: EventImage,
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'eventId']
      }
    },
    {
      model: Attendance
    },
    {
      model: Venue,
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'groupId']
      }
    },
  ]});

  if(!event){
    res.statusCode = 404;
    return res.json({
      "message": "Event couldn't be found"
    });
  }

  //Parse event
  parsed = event.toJSON();

  // Set group
  let group = await Group.findOne({
    where: {
      id: parsed.groupId
    },
    attributes: ['id', 'name', 'private', 'city', 'state']
  })
  parsed.Group = group.toJSON();

  //Set numAttending
  parsed.numAttending = await Attendance.count({
    where: {
      status: 'attending',
      eventId: parsed.id
    }
  });
  delete parsed.Attendances;
  res.json(parsed);
});


//Add an Image to a Event based on the Event's id
router.post('/:eventId/images', requireAuth, async (req, res) => {
  //Get Event
  const event = await Event.findOne({
    where:{
      id: req.params.eventId
    },
  });
  if(!event){
    res.statusCode = 404;
    return res.json({
    "message": "Event couldn't be found"
  });
  }
  //Get groups and roles
  const group = await Group.findOne({
    where:{
      id: event.toJSON().groupId
    },
    include: [
      {
        model: Membership
      }
    ]
  });
  //Get attendees
  const attendees = await Attendance.findOne({
    where: {
      eventId: req.params.eventId,
      userId: req.user.id,
      status: 'attending'
    }
  })

  //3 check, if owner of group, co-host role in group, or attending
  let confirm = false;
  if(group.toJSON().organizerId === req.user.id) confirm = true;
  for(member of group.toJSON().Memberships){
    if(member.userId === req.user.id && member.status === 'co-host') confirm = true;
  }
  if(attendees)confirm = true;
  if(confirm){
    const check = await event.createEventImage(req.body);
    let parsed = check.toJSON();
    delete parsed.eventId;
    delete parsed.updatedAt;
    delete parsed.createdAt;
    return res.json(parsed);
  }

  res.statusCode = 404;
  res.json({
    "message": "Event couldn't be found"
  });
});

router.put('/:eventId', requireAuth, validateEvent, async (req, res) => {
  const event = await Event.findOne({
    where:{
      id: req.params.eventId
    },
  });
  if(!event){
    res.statusCode = 404;
    return res.json({
    "message": "Event couldn't be found"
  });
  }

  //Get groups and roles
  const group = await Group.findOne({
    where:{
      id: event.toJSON().groupId
    },
    include: [
      {
        model: Membership
      }
    ]
  });
  let confirm = false;
  if(group.toJSON().organizerId === req.user.id) confirm = true;
  for(member of group.toJSON().Memberships){
    if(member.userId === req.user.id && member.status === 'co-host') confirm = true;
  }
  if(confirm){
    event.set(req.body);
    await event.save();
    let copy = event.toJSON();
    delete copy.createdAt;
    delete copy.updatedAt;
    return res.json(copy);
  }
  res.statusCode = 404;
  res.json({
    "message": "Event couldn't be found"
  });
});


// Delete an Event specified by its id
router.delete('/:eventId', requireAuth, async (req, res) => {
  const event = await Event.findOne({
    where:{
      id: req.params.eventId
    },
  });
  if(!event){
    res.statusCode = 404;
    return res.json({
    "message": "Event couldn't be found"
  });
  }

  //Get groups and roles
  const group = await Group.findOne({
    where:{
      id: event.toJSON().groupId
    },
    include: [
      {
        model: Membership
      }
    ]
  });
  let confirm = false;
  if(group.toJSON().organizerId === req.user.id) confirm = true;
  for(member of group.toJSON().Memberships){
    if(member.userId === req.user.id && member.status === 'co-host') confirm = true;
  }
  if(confirm){
    await event.destroy();
    return res.json({
      "message": "Successfully deleted"
    });
  }
  res.statusCode = 404;
  res.json({
    "message": "Event couldn't be found"
  });
})


module.exports = router;
