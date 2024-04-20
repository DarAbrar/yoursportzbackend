const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');



const userRoute = require('./routes/user/userRoutes');
const authRoute = require('./routes/auth/authRoutes');


// config middleware
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const dbUsername = process.env.DB_USERNAME
const dbPassword = process.env.DB_PASSWORD

//Connect to MongoDB
const url = `mongodb+srv://${dbUsername}:${dbPassword}@freeserver.q3czfob.mongodb.net/`

// route urls
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);


const port = process.env.PORT || 8080;
// db connection
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(port, () => {
        console.log(`Backend server is running on port ${port}`);
    });
}).catch((error) => {
    console.error(`${error} did not connect`);
});
