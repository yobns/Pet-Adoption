const express = require('express');
const router = express.Router();
const { validateJWT } = require('../middlewares/authMiddleware');
const { createPet, getPets, getPetById, editPet, adoptFoster, returnPet, save, unsave, getPetsById, deletePet } = require('../controller/petController');
const { filter } = require('../middlewares/searchMiddleware');
const { upload } = require('../middlewares/imageMiddleware')

router.post('/', validateJWT, upload.single('image'), createPet);
router.get('/search', filter, getPets);
router.get('/searchAll', getPets);
router.get('/:id', getPetById);
router.put('/:id', validateJWT, upload.single('image'), editPet);
router.delete('/:id', validateJWT, deletePet)

router.put('/:id/adoptFoster', validateJWT, adoptFoster);
router.delete('/:id/return', validateJWT, returnPet);

router.put('/:id/save', validateJWT, save);
router.delete('/:id/unsave', validateJWT, unsave);
router.get('/user/:id',validateJWT, getPetsById);

module.exports = router;