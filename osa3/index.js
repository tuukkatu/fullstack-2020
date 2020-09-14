const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body' ))



const time = new Date()



let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id:1
    },
    {
        name: "Ada Lovelace",
        number: "29-44-5323523",
        id:2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id:3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id:4
    }
]

const personAmount = persons.length

app.get('/', (req, res) => {
    res.send('<h1>Hello world!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    
    if(person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const generateId = (max) => {
    return Math.floor(Math.random() * Math.floor(max))
}

const nameExists = (body) => {
    const exist = persons.filter(person => person.name === body.name)
    return exist.length >0
}

app.post('/api/persons', (req, res) => {

    const body = req.body
    console.log(body)

    if(nameExists(body)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    if(!body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    }
    if(!body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(10000)
    }
    persons = persons.concat(person)
    res.json(person)
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${personAmount} people</p><p>${time}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})