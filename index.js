import express from 'express'
import cors from 'cors'
import Note from './models/note.js'
import 'dotenv/config'
import { Query } from 'mongoose';
const app = express();
app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
const errorHandling = (error, req, res, next) => {
    if (error.name === 'CastError') {
        return res.status(400).json({ error: 'malformatted id' })
    }
    else if(error.name === 'ValidationError'){
        return res.status(404).json({
            error: error.message
        })
    }
    next(error)
}

app.use(cors())
app.use(express.json())
app.use(requestLogger)

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
    Note.find({})
        .then(note => {
            res.json(note)
        })
        .catch(err => {
            console.log(err);
        })
})

app.get('/api/notes/:id', (req, res, next) => {
    Note.findById(req.params.id)
        .then(note => {
            if (note) {
                res.json(note)
            }
            else {
                res.status(404).end()
            }
        })
        .catch(err => {
            return next(err)
        })
})

app.delete('/api/notes/:id', (req, res, next) => {
    Note.findByIdAndDelete(req.params.id)
    .then(result =>{
        res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/notes/:id', (req, res, next) => {
        const {content, important} = req.body
    Note.findByIdAndUpdate(req.params.id, { content, important }, { new:true, runValidators:true, context:'query' } )
    .then(updatedNote=>{
        res.json(updatedNote)
    })
    .catch(err=>next(err))
})

app.post("/api/notes", (req, res, next) => {
    const body = req.body

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })
    note.save()
        .then(saveNote => {
            res.json(saveNote)
        })
        .catch(err=>next(err))
})
app.use(unknownEndpoint)
app.use(errorHandling)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
})