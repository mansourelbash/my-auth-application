const express = require('express');
const RealEstate = require('../models/RealEstate');
const User = require('../models/User');
const { verifyToken, verifyAdmin } = require('../middleware/verifyToken');
const { v4: uuidv4 } = require('uuid'); // Importing uuid library

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: RealEstate
 *   description: Real estate management routes
 */

/**
 * @swagger
 * /api/realestate/add:
 *   post:
 *     summary: Add a new real estate listing
 *     description: Creates a new real estate listing and associates it with the authenticated user.
 *     tags: [RealEstate]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *                   country:
 *                     type: string
 *               propertyType:
 *                 type: string
 *                 enum: [Apartment, House, Condo, Land]
 *               size:
 *                 type: number
 *               bedrooms:
 *                 type: number
 *               bathrooms:
 *                 type: number
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Real estate listing created successfully.
 *       500:
 *         description: Server error.
 */
router.post('/add', verifyToken, async (req, res) => {
    const { title, description, price, address, propertyType, size, bedrooms, bathrooms, features, images } = req.body;
  
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const newRealEstate = new RealEstate({
        title,
        description,
        price,
        address,
        propertyType,
        size,
        bedrooms,
        bathrooms,
        features,
        images,
        agent: {
          name: user.username,
          contact: user.email
        },
        user: user._id,
        id: uuidv4(),
      });
  
      await newRealEstate.save();
  
      res.status(201).json({ message: 'Real estate listing created successfully', realEstate: newRealEstate });
    } catch (error) {
      console.error("Error creating real estate listing:", error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
});

/**
 * @swagger
 * /api/realestate/add-multiple:
 *   post:
 *     summary: Add multiple real estate listings
 *     description: Creates multiple real estate listings and associates them with the authenticated user.
 *     tags: [RealEstate]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 address:
 *                   type: object
 *                   properties:
 *                     street:
 *                       type: string
 *                     city:
 *                       type: string
 *                     state:
 *                       type: string
 *                     postalCode:
 *                       type: string
 *                     country:
 *                       type: string
 *                 propertyType:
 *                   type: string
 *                   enum: [Apartment, House, Condo, Land]
 *                 size:
 *                   type: number
 *                 bedrooms:
 *                   type: number
 *                 bathrooms:
 *                   type: number
 *                 features:
 *                   type: array
 *                   items:
 *                     type: string
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *     responses:
 *       201:
 *         description: Multiple real estate listings created successfully.
 *       500:
 *         description: Server error.
 */
router.post('/add-multiple', verifyToken, async (req, res) => {
    const listings = req.body; // Expecting an array of listings

    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const newRealEstates = await Promise.all(listings.map(async (listing) => {
        const newRealEstate = new RealEstate({
          ...listing,
          agent: {
            name: user.username,
            contact: user.email
          },
          user: user._id,
          id: uuidv4(),
        });

        return await newRealEstate.save();
      }));

      res.status(201).json({ message: 'Multiple real estate listings created successfully', realEstates: newRealEstates });
    } catch (error) {
      console.error("Error creating multiple real estate listings:", error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
});

/**
 * @swagger
 * /api/realestate/update/{id}:
 *   put:
 *     summary: Update a real estate listing
 *     description: Updates an existing real estate listing. The user must be the owner of the listing.
 *     tags: [RealEstate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the real estate listing to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *                   country:
 *                     type: string
 *               propertyType:
 *                 type: string
 *                 enum: [Apartment, House, Condo, Land]
 *               size:
 *                 type: number
 *               bedrooms:
 *                 type: number
 *               bathrooms:
 *                 type: number
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Real estate listing updated successfully.
 *       404:
 *         description: Real estate listing not found.
 *       500:
 *         description: Server error.
 */
router.put('/update/:id', verifyToken, async (req, res) => {
  const { title, description, price, address, propertyType, size, bedrooms, bathrooms, features, images } = req.body;
  const { id } = req.params;

  try {
    const realEstate = await RealEstate.findOne({ id, user: req.user._id });
    if (!realEstate) {
      return res.status(404).json({ message: 'Real estate listing not found or you do not have permission to update it' });
    }

    realEstate.title = title || realEstate.title;
    realEstate.description = description || realEstate.description;
    realEstate.price = price || realEstate.price;
    realEstate.address = address || realEstate.address;
    realEstate.propertyType = propertyType || realEstate.propertyType;
    realEstate.size = size || realEstate.size;
    realEstate.bedrooms = bedrooms || realEstate.bedrooms;
    realEstate.bathrooms = bathrooms || realEstate.bathrooms;
    realEstate.features = features || realEstate.features;
    realEstate.images = images || realEstate.images;

    await realEstate.save();

    res.status(200).json({ message: 'Real estate listing updated successfully', realEstate });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/realestate/delete/{id}:
 *   delete:
 *     summary: Delete a real estate listing
 *     description: Deletes a real estate listing. The user must be the owner of the listing.
 *     tags: [RealEstate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the real estate listing to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Real estate listing deleted successfully.
 *       404:
 *         description: Real estate listing not found.
 *       500:
 *         description: Server error.
 */
router.delete('/delete/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const realEstate = await RealEstate.findOneAndDelete({ id, user: req.user._id });
    if (!realEstate) {
      return res.status(404).json({ message: 'Real estate listing not found or you do not have permission to delete it' });
    }

    res.status(200).json({ message: 'Real estate listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/realestate:
 *   get:
 *     summary: Get all real estate listings
 *     description: Returns a list of all real estate listings.
 *     tags: [RealEstate]
 *     responses:
 *       200:
 *         description: A list of real estate listings.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RealEstate'
 *       500:
 *         description: Server error.
 */
router.get('/', async (req, res) => {
  try {
    const realEstateList = await RealEstate.find({});
    res.status(200).json(realEstateList);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/realestate/{id}:
 *   get:
 *     summary: Get a real estate listing by ID
 *     description: Returns a specific real estate listing by ID.
 *     tags: [RealEstate]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the real estate listing to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Real estate listing found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RealEstate'
 *       404:
 *         description: Real estate listing not found.
 *       500:
 *         description: Server error.
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const realEstate = await RealEstate.findOne({ id });
    if (!realEstate) {
      return res.status(404).json({ message: 'Real estate listing not found' });
    }

    res.status(200).json(realEstate);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
