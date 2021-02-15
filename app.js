const bicyclesRoutes = require('./routes/bicycles');
const usersRoutes = require('./routes/users');

const mongoose = require('mongoose');

const express = require('express');

const config = {
  PORT: 3000,
  DB_ADDRESS: 'mongodb://localhost/rent-service',
}

const app = express();
app.use(express.json())

app.use('/bicycles', bicyclesRoutes)
app.use('/users', usersRoutes)

app.get('/', (req, res) => {
  res.send('System is up');
});

(async () => {
  try {
    await mongoose.connect(config.DB_ADDRESS, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });

    app.listen(config.PORT);
    console.log(`App is listening on port: ${config.PORT}`);
  } catch (e) {
    console.error(e)
  }
})();



