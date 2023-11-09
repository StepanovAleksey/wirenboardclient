import { Driver } from './models/driverModel';
import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors';
import './serial';
import { serialBus } from './serialBus';

const driver1 = new Driver(1, 1, serialBus);


const app = express()
const port = 3000
app.use(bodyParser.json())
app.use(cors())

app.get('/status', (req, res) => {
    res.json({ position: driver1.lastDriverStatus$.value });
})

app.post('/command', (req, res) => {
    const command = req.body.command;
    driver1.sendCommand(command);
    res.end();
})

app.post('/goPercent', (req, res) => {
    const percent = req.body.percent;
    driver1.goToPercent(percent);
    res.end();
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


