const Pet = require('../models/petModel');
const User = require('../models/userModel');

async function createPet(req, res) {
    const { type, name, status, height, weight, color, bio, hypoallergenic, restrictions, breed } = req.body;
    const image = req.file.path;

    if (!req.user.isAdmin)
        return res.status(403).send('Access denied. Only admins can add pets.');

    try {
        await Pet.create({ type, name, status, height, weight, color, bio, hypoallergenic, restrictions, breed, image });
        res.send('Pet created');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering new pet');
    }
}

async function getPets(req, res) {
    try {
        const pets = await Pet.find(req.filters);
        res.json(pets);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching pets');
    }
}

async function getPetById(req, res) {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet)
            return res.status(404).send('Pet not found');
        res.json(pet);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching pet');
    }
}

async function editPet(req, res) {
    const { type, name, status, height, weight, color, bio, hypoallergenic, restrictions, breed } = req.body;
    const image = req.file ? req.file.path : undefined;

    try {
        const pet = await Pet.findById(req.params.id);
        console.log(pet.image)
        if (!pet)
            return res.status(404).send('Pet not found');

        if (!req.user.isAdmin)
            return res.status(403).send('Access denied. Only admins can edit pets.');

        pet.type = type;
        pet.name = name;
        pet.status = status;
        pet.height = height;
        pet.weight = weight;
        pet.color = color;
        pet.bio = bio;
        pet.hypoallergenic = hypoallergenic;
        pet.restrictions = restrictions;
        pet.breed = breed;

        if (image)
            pet.image = image;

        await pet.save();
        res.send('Pet updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating pet');
    }
}

async function adoptFoster(req, res) {
    try {
        const petId = req.params.id;
        const userId = req.user.id;
        const type = req.body.type;

        const pet = await Pet.findById(petId);
        if (!pet)
            return res.status(404).send('Pet not found');

        if (type === 'Adopt') {
            pet.adoptedBy = userId;
            pet.status = 'Adopted';
        } else if (type === 'Foster') {
            pet.fosteredBy = userId;
            pet.status = 'Fostered';
        }
        await pet.save();
        res.status(200).json(pet);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function returnPet(req, res) {
    try {
        const petId = req.params.id;
        const pet = await Pet.findById(petId);
        if (!pet)
            return res.status(404).send('Pet not found');

        pet.status = 'Available';
        pet.adoptedBy = null;
        pet.fosteredBy = null;

        await pet.save();
        res.status(200).json(pet);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function save(req, res) {
    try {
        const petId = req.params.id;
        const userId = req.user.id;

        const pet = await Pet.findById(petId);
        if (!pet)
            return res.status(404).send('Pet not found');

        const user = await User.findById(userId);
        if (!user)
            return res.status(404).send('User not found');

        if (user.savedPets.includes(petId))
            return res.status(400).send('Pet already saved');

        user.savedPets.push(petId);
        await user.save();
        res.status(200).send('Pet saved successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving pet');
    }
}

async function unsave(req, res) {
    try {
        const petId = req.params.id;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user)
            return res.status(404).send('User not found');

        const petIndex = user.savedPets.indexOf(petId);
        if (petIndex === -1)
            return res.status(404).send('Pet not found in saved list');

        user.savedPets.splice(petIndex, 1);
        await user.save();
        res.status(200).send('Pet unsaved successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error unsaving pet');
    }
}

async function getPetsById(req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (!user)
            return res.status(404).send('User not found');
        res.json(user);
    } catch (error) {
        res.status(500).send('Server error');
    }
}

async function deletePet(req, res) {
    try {
        const petId = req.params.id;
        const deletedPet = await Pet.findByIdAndDelete(petId);

        if (!deletedPet)
            return res.status(404).json({ message: 'Pet not found' });

        res.status(200).json({ message: 'Pet deleted successfully' });
    } catch (error) {
        console.error('Error deleting pet:', error);
        res.status(500).send('server error');
    }
}

module.exports = { createPet, getPets, getPetById, editPet, adoptFoster, returnPet, save, unsave, getPetsById, deletePet };