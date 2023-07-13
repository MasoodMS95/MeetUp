const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, GroupImage, Membership, Venue, User } = require('../../db/models');

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
    .withMessage('City is required'),
  handleValidationErrors
];

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
    group.numMembers = group.Memberships.length;
    delete group.Memberships;
    group.GroupImages.forEach(image => {
      if(image.preview){
        group.previewImage = image.url;
      }
    });
    delete group.GroupImages;
  })

  const formattedResponse = {};
  formattedResponse.Groups = groupList;
  res.json(formattedResponse);
})

//Get groups by current user
router.get('/current', requireAuth, async (req, res) => {
  const data = await Group.findAll({
    where: {
      organizerId: req.user.id
    },
    include:[
    {
      model: GroupImage
    },
    {
      model: Membership
    }
  ]});

  let groupList = [];

  data.forEach(group => {
    groupList.push(group.toJSON());
  })

  groupList.forEach(group => {
    group.numMembers = group.Memberships.length;
    delete group.Memberships;
    group.GroupImages.forEach(image => {
      if(image.preview){
        group.previewImage = image.url;
      }
    });
    delete group.GroupImages;
  })

  const formattedResponse = {};
  formattedResponse.Groups = groupList;
  res.json(formattedResponse);
})

//Get user by groupID
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

  parsed.numMembers = parsed.Memberships.length;
  delete parsed.Memberships

  parsed.Organizer = organizer;
  res.json(parsed);
});

//create a group
router.post('/', requireAuth, validateGroup, async (req, res) => {
  const {name, about, type, private, city, state} = req.body;
  const organizerId = req.user.id;
  const group = await Group.create({organizerId, name, about, type, private, city, state})
  res.statusCode = 201;
  res.json(group);
});

//add image to group based on group id
router.post('/:groupId/images', requireAuth, async (req, res) => {
  const group = await Group.findOne({
    where: {
      id: req.params.groupId
    }
  });
  if(group.organizerId === req.user.id){
    const newEntry = await group.createGroupImage(req.body);
    res.json(newEntry);
  }
  res.statusCode = 404;
  res.json({
    "message": "Group couldn't be found"
  })
});

//Edit a group
router.put('/:groupId', requireAuth, validateGroup, async (req, res) => {
  const group = await Group.findOne({
    where: {
      id: req.params.groupId
    }
  });
  if(group){
    group.set(req.body);
    await group.save();
    res.json(group);
  }
  res.statusCode = 404;
  res.json({
    "message": "Group couldn't be found"
  });
});

//Delete a group
router.delete('/:groupId', requireAuth, async (req, res) => {
  const group = await Group.findOne({
    where: {
      id: req.params.groupId
    }
  });
  if(group && group.organizerId === req.user.id){
    await group.destroy();
    res.json({
      "message": "Successfully deleted"
    })
  }
  res.statusCode = 404;
  res.json({
    "message": "Group couldn't be found"
  });
})

module.exports = router;
