const express = require('express');
const axios = require('axios');

const IP_ADDRESS = '127.0.0.1';
const MANAGEMENT_APPLICATION_HOST = 'localhost:3000';
const PING_INTERVAL = 60000;

const [a, b, SYSTEM_ID, PORT] = process.argv;

let state = {
  locked: true,
  status: 'N/A',
  light: 'off',
  ip: `${IP_ADDRESS}:${PORT}`,
};

const updateModel = async (data) => {
  try {
    const response = await axios.patch(
      `http://${MANAGEMENT_APPLICATION_HOST}/bicycles/${SYSTEM_ID}`,
      data,
    );
    return response;
  } catch (e) {
    console.error('No connection to management application');
  }
};

const app = express();
app.use(express.json());

const getCurrentLocation = () => `RANDOM LOCATION${new Date()}`;

const turnOn = async () => {
  console.log('Bike is starting...');
  state.status = 'free';
  app.listen(PORT);

  console.log(`Bike is listening on port: ${PORT}`);

  await updateModel(state);

  setInterval(async () => {
    console.log('Sending current status to management application');
    await updateModel({
      ...state,
      location: getCurrentLocation(),
    });
  }, PING_INTERVAL);
};

app.get('/', (req, res) => {
  res.send(state);
});

app.post('/', async (req, res) => {
  try {
    console.log('Updating bike status from management application...');
    const {body} = req;
    state = {...state, ...body};

    res.send(state);
  } catch (e) {
    console.error(e);
    res.send(e);
  }
});

turnOn();
