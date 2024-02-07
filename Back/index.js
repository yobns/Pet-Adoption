const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const app = express();
const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');
require('dotenv').config();

const URI = process.env.URI;
const PORT = process.env.PORT;

app.use(cors({origin: ['http://localhost:3000', 'https://fs-pet-adoption-fe-yobns.vercel.app']}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/', userRoutes);
app.use('/pets', petRoutes);

async function init() {
    const connection = await mongoose.connect(URI, { dbName: 'PetAdoption' })
    if (connection) {
        console.log('Connected to DB')
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        })
    }
}

init()
module.exports = app;