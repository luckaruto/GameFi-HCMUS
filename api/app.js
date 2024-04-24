const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRouter');
const {catchEventNFT} = require('./catchNFTEvents.js');
const models = require('./database/models');
const { formatResponse } = require('./middlewares');
const { nftRouter, tokenUriRouter, itemGameRouter, itemAppRouter, itemGameOwnerRouter, itemAppOwnerRouter } = require('./routes');

const app = express();
const port = process.env.PORT|| 4500;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(formatResponse)

// Routes
app.use('/user', userRouter);
app.use('/nfts', nftRouter);
app.use('/tokenUris', tokenUriRouter);
app.use('/itemGames', itemGameRouter);
app.use('/itemApps', itemAppRouter);
app.use('/itemGameOwners', itemGameOwnerRouter);
app.use('/itemAppOwners', itemAppOwnerRouter);


async function connectDB() {
  try {
    
    await models.sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await models.sequelize.sync({ alter: true });
    console.log('All models are sync successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
}

connectDB().then((connected) => {
  if (connected) {

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      //====================================Events====================================//
      // Catch Events
      catchEventNFT();
    });
  }
});
