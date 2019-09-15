const express = require('express');
const bodyParser = require('body-parser');
const dependencyCheck = require('./module/dependencyCheck');
const logger = require('./utils/logger')




const app = express();
app.use(logger);
app.use(bodyParser.json());

app.use((err, req, res, next) => {
    res.status(500).send('Error!');  
});



app.post('/frapp/api/dependencies', (req, res) => {
    try{
        res.send(   {"open": dependencyCheck(req.body)} );
    } catch(err) {
       res.status(400).send(err.message);
    }

});


app.listen(process.env.PORT || 3000);