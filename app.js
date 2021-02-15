const bicyclesRoutes = require('./routes/bicycles');
const usersRoutes = require('./routes/users');

const mongoose = require('mongoose');

const express = require('express');

const { PORT, DB_ADDRESS } = require('./config.js')

const app = express();
app.use(express.json());

app.use('/bicycles', bicyclesRoutes);
app.use('/users', usersRoutes);

app.get('/', (req, res) => {
  res.send('System is up');
});

(async () => {
  try {
    await mongoose.connect(DB_ADDRESS, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });

    app.listen(PORT);
    console.log(`App is listening on port: ${PORT}`);
  } catch (e) {
    console.error(e)
  }
})();



