import express  from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import {MONGO_URL} from './V1/config/index.js'
import cors from 'cors';


const port = 5000 
const app = express()
app.use(express.json())

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'ejs'); //view engine others are hbs, html or react 


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // Update to match the domain you will make the request from
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });



import { userRoute } from './V1/routes/userRoute.js';
app.use('/user', userRoute);

app.get('/', (req, res) => {
    
   res.send('Welcome to Lemu Apis')
  })




//connect to mongodb
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

app.listen(port, () => {
    console.log(`Lume pay listening at http://localhost:${port}`)
    }
)