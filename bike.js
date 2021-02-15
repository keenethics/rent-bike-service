const express = require('express');
const axios = require('axios');

const IP_ADDRESS = '127.0.0.1';
const MANAGEMENT_APPLICATION_HOST = 'localhost:3000'

const [a, b, SYSTEM_ID, PORT] = process.argv;

let state = {
  status: 'N/A',
  light: 'off'
};

const updateModel = async (data) => {
  try {
    const response = await axios.patch(
      `http://${MANAGEMENT_APPLICATION_HOST}/bicycles/${SYSTEM_ID}`,
      data);
    // console.log(response);
    return response;
  } catch (e) {
    console.error(e);
  }
};


const app = express();
app.use(express.json())

const turnOn = async () => {
  console.log('Bike is starting...');
  state.status = 'free';
  app.listen(PORT);

  console.log(`Bike is listening on port: ${PORT}`);

  await updateModel({
    status: state.status,
    light: state.light,
    ip: `${IP_ADDRESS}:${PORT}`,
  });
}

app.get('/', (req, res) => {
  res.send(state);
});

app.post('/', async (req, res) => {
  try {
    const { body } = req;
    state = {...state, ...body};

    console.log(state);

    res.send(state);
  } catch (e) {
    console.error(e)
  }
})


turnOn();