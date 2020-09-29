require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')
const cors = require('cors')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body' ))


app.get('/', (req, res) => {
  res.send('<h1>Phonebook!</h1>')
})

app.get('/info', (req, res) => {
  Person.count({}, function(err, count) {
    res.send(`Phonebook has info for ${count} people. ${Date()}`)
  })
})

app.get('/api/persons', (req, res) => {

  Person.find({}).then(persons => {
    res.json(persons.map(person => person))
  })
  /* eslint-disable */  
  .catch(error => next(error))
  /* eslint-enable */
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
    id: body.id,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = (max) => {
  return Math.floor(Math.random() * Math.floor(max))
}


app.post('/api/persons', (req, res, next) => {

  const body = req.body
  console.log(body)

  if(!body.name) {
    return res.status(400).json({
      error: 'unique name required'
    })
  }
  if(!body.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }
  const person = new Person({
    id: generateId(10000),
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => { return savedPerson })
    .then(savedAndFormattedPerson => {
      console.log('saved', savedAndFormattedPerson)
      res.json(savedAndFormattedPerson)

    })
    .catch(error => next(error))
})


const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})