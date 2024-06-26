
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
// import { MONGO_URL } from './V1/config/index.js';
import cors from 'cors';
import { userRoute } from './V1/routes/userRoute.js';
import dotenv from 'dotenv';
// import admin from 'firebase-admin'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
//const port = 3000; // Define your port

const MONGO_URL = process.env.MONGO_URL

const allowedOrigins = ['https://lemu.africa', 'http://localhost:5000', 'http://localhost:3000', 'http://localhost:3001'];

const corsOptions = {
  origin: allowedOrigins,
  // You can also add other options like methods, headers, etc.
};

//app.use(cors())

// const serviceAccount = 'V1/config/firebaseKKey.json'
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // view engine others are hbs, html or react



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // Update to match the domain you will make the request from
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


app.use('/user', userRoute);

app.get('/', (req, res) => {
  res.send('Welcome to Lemu Api, payment system for everyone new update');
});

// connect to mongodb
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

app.listen(PORT,'0.0.0.0', () => {
  console.log(`Lume pay listening at http://localhost:${PORT}`);
});
