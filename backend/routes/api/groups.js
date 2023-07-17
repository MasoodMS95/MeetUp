const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, GroupImage, Membership, Venue, User, EventImage, Attendance, Event } = require('../../db/models');

const validateGroup = [
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 60 })
    .withMessage('Name must be 60 characters or less'),
  check('about')
    .exists({ checkFalsy: true })
    .isLength({ min: 50 })
    .withMessage('About must be 50 characters or more'),
  check('type')
    .exists({ checkFalsy: true })
    .isIn(['Online', 'In person'])
    .withMessage("Type must be 'Online' or 'In person'"),
  check('private')
    .exists({ checkFalsy: true })
    .isIn([true, false])
    .withMessage('Private must be a boolean'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  handleValidationErrors
];

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

  validateMembershipChange = [
    check('status')
      .not().isIn(['pending'])
      .withMessage("Cannot change a membership status to pending"),
    check('memberId')
    .custom(async (memberId, { req }) => {
      const member = await User.findOne({
        where: {
          id: memberId
        }
      })
      if(member){
        return true;
      }
      throw new Error("User couldn't be found")
    }),
    handleValidationErrors
  ]

  validateMembershipDeletion = [
    check('memberId')
      .custom(async (memberId, { req }) => {
        const user = await User.findOne({
          where: {
            id:memberId
          }
        })
        if(!user) throw new Error("User couldn't be found");
        return true;
      }),
    handleValidationErrors
  ]

//Get all groups
router.get('/', async (req, res) => {
  const data = await Group.findAll({
    include:[
    {
      model: GroupImage
    },
    {
      model: Membership
    },
  ]});
  let groupList = [];

  data.forEach(group => {
    groupList.push(group.toJSON());
  })

  groupList.forEach(group => {
    if(group.Memberships.length){
      group.numMembers = group.Memberships.length;
    }
    else group.numMembers = 1;
    delete group.Memberships;
    if(group.GroupImages.length){
      group.GroupImages.forEach(image => {
        if(image.preview){
          group.previewImage = image.url;
        }
      });
    }
    else{group.previewImage = "No image available"}
    delete group.GroupImages;
  })

  const formattedResponse = {};
  formattedResponse.Groups = groupList;
  res.json(formattedResponse);
})


//Get groups by current user
router.get('/current', requireAuth, async (req, res) => {
  const data = await Group.findAll({
    include:[
    {
      model: GroupImage
    },
    {
      model: Membership,
    }
  ]});

  let groupList = [];
  data.forEach(group => {
    if(group.toJSON().organizerId === req.user.id){
      groupList.push(group.toJSON());
    }
    else{
      for(let member of group.toJSON().Memberships) {
        if(member.userId === req.user.id){
          groupList.push(group.toJSON());
          break;
        }
      }
    }
  })
  groupList.forEach(group => {
    if(group.Memberships.length){
      group.numMembers = group.Memberships.length;
    }
    else group.numMembers = 1;
    delete group.Memberships;
    if(group.GroupImages.length){
      group.GroupImages.forEach(image => {
        if(image.preview){
          group.previewImage = image.url;
        }
      });
    }
    else{group.previewImage = "No image available"}
    delete group.GroupImages;
  })

  const formattedResponse = {};
  formattedResponse.Groups = groupList;
  res.json(formattedResponse);
})


//Get details of a Group from an id
router.get('/:groupId', requireAuth, async (req, res) => {
  const data = await Group.findOne({
    where: {
      id: req.params.groupId
    },
    include:[
    {
      model: GroupImage,
      attributes: ['id','url','preview']
    },
    {
      model: Membership,
    },
    {
      model: Venue,
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }
  ]});

  const parsed = data.toJSON();

  const organizer = await User.findOne({
    where: {
      id: parsed.organizerId
    },
    attributes: ['id', 'firstName', 'lastName']
  })

  if(parsed.Memberships.length){
    parsed.numMembers = parsed.Memberships.length;
  }
  else parsed.numMembers = 1;
  delete parsed.Memberships

  parsed.Organizer = organizer;
  res.json(parsed);
});


//create a group
router.post('/', requireAuth, validateGroup, async (req, res) => {
  const organizerId = req.user.id;
  const group = await Group.create({organizerId, ...req.body})
  res.statusCode = 201;
  res.json(group);
});

//add an image to group based on group id
router.post('/:groupId/images', requireAuth, async (req, res) => {
  const group = await Group.findOne({
    where: {
      id: req.params.groupId
    }
  });
  if(!group){
    res.statusCode = 404;
    return res.json({
      "message": "Group couldn't be found"
    })
  }
  if(group.organizerId === req.user.id){
    const newEntry = await group.createGroupImage(req.body);
    let copy = {};
    copy.id = newEntry.id;
    copy.url = newEntry.url;
    copy.preview = newEntry.preview;
    return res.json(copy);
  }
  else{
    res.status(403).json({
      "message": "Forbidden"
    })
  }
});


//Edit a group
router.put('/:groupId', requireAuth, validateGroup, async (req, res) => {
  const group = await Group.findOne({
    where: {
      id: req.params.groupId
    }
  });
  if(!group){
    res.statusCode = 404;
    return res.json({
      "message": "Group couldn't be found"
    });
  }
  if(group.organizerId === req.user.id){
    group.set(req.body);
    await group.save();
    return res.json(group);
  }
  else{
    res.status(403).json({
      "message": "Forbidden"
    })
  }
});


//Delete a group
router.delete('/:groupId', requireAuth, async (req, res) => {
  const group = await Group.findOne({
    where: {
      id: req.params.groupId
    }
  });
  if(!group){
    res.statusCode = 404;
    return res.json({
      "message": "Group couldn't be found"
    });
  }
  if(group.organizerId === req.user.id){
    await group.destroy();
    return res.json({
      "message": "Successfully deleted"
    })
  }
  else{
    res.status(403).json({
      "message": "Forbidden"
    })
  }
})


//Get all Venues for a Group Specified by its id.
router.get('/:groupId/venues', requireAuth, async (req, res) => {
  const groupData = await Group.findOne({
    where: {
      id: req.params.groupId
    },
    include: [
      {
        model: Membership
      },
      {
        model: Venue,
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      }
    ]
  });

  if(groupData){
    let parsed = groupData.toJSON();
    let confirmed = false;
    if(parsed.organizerId === req.user.id) confirmed = true;
    parsed.Memberships.forEach(member => {
      if(member.userId === req.user.id && member.status === 'co-host'){
        confirmed = true;
      }
    })

    if(confirmed){
      let response = {};
      response.Venues = parsed.Venues;
      return res.json(response);
    }
    else{
      return res.status(403).json({
        "message": "Forbidden"
      })
    }
  }

  res.statusCode = 404;
  res.json({
    "message": "Group couldn't be found"
  });
})


//Create a new Venue
router.post('/:groupId/venues', requireAuth, validateVenue, async (req, res) => {
  const groupData = await Group.findOne({
    where: {
      id: req.params.groupId
    },
    include: [
      {
        model: Membership
      },
    ]
  });

  if(groupData){
    let parsed = groupData.toJSON();
    let confirmed = false;
    if(parsed.organizerId === req.user.id) confirmed = true;
    parsed.Memberships.forEach(member => {
      if(member.userId === req.user.id && member.status === 'co-host'){
        confirmed = true;
      }
    })

    if(confirmed){
      const newVenue = await groupData.createVenue(req.body);
      const copy = newVenue.toJSON();
      delete copy.updatedAt;
      delete copy.createdAt
      return res.json(copy);
    }
    else{
      return res.status(403).json({
        "message": "Forbidden"
      })
    }
  }
  else{
    res.statusCode = 404;
    res.json({
      "message": "Group couldn't be found"
    });
  }
})


//Get all Events of a Group specified by its id
router.get('/:groupId/events', async (req, res) => {
  const events = await Event.findAll({
    where:{
      groupId: req.params.groupId
    },
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

  let group = await Group.findOne({
    where: {
      id: req.params.groupId
    },
    attributes: ['id', 'name', 'city', 'state']
  })
  if(!group){
    res.statusCode = 404;
    return res.json({
      "message": "Group couldn't be found"
    });
  }

  for(let event of eventList){
    // Set group
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


//Create an Event for a Group specified by its id
router.post('/:groupId/events', requireAuth, validateEvent, async (req, res) => {
  const group = await Group.findOne({
    where: {
      id: req.params.groupId
    },
    include: [{
      model: Membership
    }]
  });
  if(group){
    let parsed = group.toJSON();
    let confirmed = false;
    if(parsed.organizerId === req.user.id) confirmed = true;
    parsed.Memberships.forEach(member => {
      if(member.userId === req.user.id && member.status === 'co-host'){
        confirmed = true;
      }
    });
    if(confirmed){
      const event = await group.createEvent(req.body);
      const copy = event.toJSON();
      delete copy.updatedAt;
      delete copy.createdAt;
      //TO DO: Add attendance for organizer of event.
      return res.json(copy);
    }
    else{
      return res.status(403).json({
        "message": "Forbidden"
      })
    }
  }
  res.statusCode = 404;
  res.json({
    "message": "Group couldn't be found"
  })
});


//Get all Members of a Group specified by its id
router.get('/:groupId/members', async (req, res) => {
  const group = await Group.findOne({
    where: {
      id: req.params.groupId
    },
    include: [
      {
       model: Membership
      }
    ]
  });
  const rawUserData = await User.findAll();
  let userData = [];
  rawUserData.forEach(user => {
    userData.push(user.toJSON())
  })
  if(group && rawUserData){
    let userList = [];
    let parsed = group.toJSON();
    let confirmed = false;
    if(parsed.organizerId === req.user.id) confirmed = true;
    parsed.Memberships.forEach(member => {
      if(member.userId === req.user.id && member.status === 'co-host'){
        confirmed = true;
      }
      userData.forEach( user => {
        if(user.id === member.userId){
          user.Membership = {};
          user.Membership.status = member.status
          delete user.username
          userList.push(user);
        }
      })
    });
    let response = {};
    if(confirmed){
      response.Member = userList;
    }
    else{
      response.Members = userList.filter(user => user.Membership.status !== 'pending')
    }
    return res.json(response);
  }

  res.statusCode = 404;
  res.json({
    "message": "Group couldn't be found"
  });
})


//Request a Membership for a Group based on the Group's id
router.post('/:groupId/membership', requireAuth, async (req, res) => {
  const group = await Group.findOne({
    where: {
      id: req.params.groupId
    },
    include:[
      {
        model: Membership
      }
    ]
  });
  if(!group){
    return res.status(404).json({
      "message": "Group couldn't be found"
    });
  }
  let exists = false;
  let parsedGroup = group.toJSON();
  parsedGroup.Memberships.forEach(member => {
    if(member.userId === req.user.id){
      exists = true;
      res.statusCode = 400;
      if(member.status === 'pending'){
        return res.json({
          "message": "Membership has already been requested"
        });
      }
      else{
        return res.json({
          "message": "User is already a member of the group"
        });
      }
    }
  })
  if(!exists){
    await Membership.create({userId: req.user.id, groupId: req.params.groupId, status: 'pending'})
    let response = {};
    response.memberId = req.user.id;
    response.status = 'pending'
    res.json(response);
  }
});


//Change the status of a membership for a group specified by id
router.put('/:groupId/membership', requireAuth, validateMembershipChange, async (req, res) => {
  const group = await Group.findOne({
    where: {
      id: req.params.groupId
    },
    include: [
      {
        model: Membership
      }
    ]
  })
  if(!group){
    return res.status(404).json({
      "message": "Group couldn't be found"
    });
  }
  //parse data and find all permissions for current user.
  let parsed = group.toJSON();
  let isCoHost = false;
  let isOwner = false;
  if(parsed.organizerId === req.user.id) isOwner = true;
  for(let member of parsed.Memberships){
    if(member.userId === req.user.id && member.status === 'co-host') isCoHost = true;
  }
  //Find membership
  const member = await Membership.findOne({
    where: {
      userId: req.body.memberId,
      groupId: req.params.groupId
    }
  })
  if(!member){
    return res.status(404).json({
      "message": "Membership between the user and the group does not exist"
    })
  }
  //validate permission and set if applicable
  if(req.body.status === 'member' && (isCoHost || isOwner)){
    member.set({status: req.body.status})
    await member.save();
    member.memberId = member.userId;
    let copy = {};
    copy.id = member.id;
    copy.groupId = req.params.groupId;
    copy.memberId = member.userId;
    copy.status = req.body.status;
    return res.json(copy);
  }
  else if(req.body.status === 'co-host' && isOwner){
    member.set({status: req.body.status})
    await member.save();
    let copy = {};
    copy.id = member.id;
    copy.groupId = req.params.groupId;
    copy.memberId = member.userId;
    copy.status = req.body.status;
    return res.json(copy);
  }
  else{
    return res.status(403).json({
      "message": "Forbidden"
    })
  }
});

//Delete membership to a group specified by id
router.delete('/:groupId/membership', requireAuth, validateMembershipDeletion,  async (req, res) => {
  const group = await Group.findOne({
    where: {
      id: req.params.groupId
    },
  })
  if(!group){
    return res.status(404).json({
      "message": "Group couldn't be found"
    });
  }
  //parse data and find all permissions for current user.
  let parsed = group.toJSON();
  let isOwner = false;
  if(parsed.organizerId === req.user.id || req.body.memberId === req.user.id) isOwner = true;

  //Find membership
  const member = await Membership.findOne({
    where: {
      userId: req.body.memberId,
      groupId: req.params.groupId
    }
  })
  if(!member){
    return res.status(404).json({
      "message": "Membership between the user and the group does not exist"
    })
  }
  if(isOwner){
    await member.destroy();
    res.json({
      "message": "Successfully deleted membership from group"
    });
  }
  else{
    res.status(403).json({
      "message": "Forbidden"
    })
  }
})

module.exports = router;
