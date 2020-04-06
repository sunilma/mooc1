const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');


const app = express();
const port = process.env.PORT || 3000;

morgan.token('data', (req, res) => {
    data = JSON.stringify(req.body);
    return data;
})

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));
app.use(cors());
app.use(express.static('build'));


const errorHandler = (error, request, response, next) => {

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).json({ error: 'malformatted id' });
      } else if(error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
      }
    
      next(error);
}

app.use(errorHandler);


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});
  
app.get('/api/persons', (req, res) => {

    Person.find().then(result => {
        res.json(result);  
    })
});

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
        if(person) {
            res.json(person);
        } else {
            res.status(404).end();
        }
    }).catch(error => next(error));
});

app.post('/api/persons', async (req, res, next) => {
    const body = req.body;

    // if(!body.name || !body.number) {
    //     return res.status(400).json({
    //         error: "Name or Number is missing"
    //     });
    // };
    // const check = await Person.findOne({name: body.name});
    // if(check) {
    //     return res.status(400).json({
    //         error: "Name must be unique"
    //     });
    // };
    const person = new Person({ name: body.name, number: body.number });

    person.save().then(result => {
        res.json(result);
    }).catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndUpdate({_id: req.params.id}, req.body, (err, result) => {
        if(err) {
            res.send(err);
        } else {
            console.log(result);
            res.json(result);
        }
    });
});

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndDelete(req.params.id, (err) => {
        if(err) console.log(err);
        console.log('successfully deleted');
        res.status(204).end();
    });
})


app.get('/info', async (req, res) => {
    const date = new Date();
    const count = await Person.find();
    const response = `<p>Phonebook has info for ${count.length} people</p><p>${date.toString()}</p>`;
    res.send(response);
})

app.listen(port,() => {
    console.log(`server is running on port ${port}`);
});