import express from 'express'
import cors from 'cors'
const app = express();
const PORT = process.env.PORT || 3001


app.use(cors())

app.use(express.static('dist'))

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

app.use(express.json())

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}


app.use(requestLogger)


app.get("/", (req, res) => {
    res.send('<h1>Hello</h1>')
})

app.get('/api/notes', (req, res) => {
    res.json(notes);
})

app.get('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const note = notes.find((note) => note.id === id)

    if (note) {
        res.json(note)
    }
    else {
        res.status(404).send("<h1>404 Not Found</h1>")
    }
})

app.delete('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    notes = notes.filter((note) => note.id !== id)
    res.status(204).end()
})

app.put('/api/notes/:id',(req,res)=>{
    const id = Number(req.params.id);
    const findInd = notes.findIndex((note)=> note.id === id)
    if(findInd === -1){
        return res.status(404).json({
            error:'Not Found'
        })
    }
    notes[findInd].important = !(notes[findInd].important)
    res.json((notes[findInd]));
})

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(note => parseInt(note.id))) : 0
    return (maxId + 1);
}

app.post("/api/notes", (req, res) => {
    const body = req.body
    if (!body.content) {
        return res.status(400).json({
            error: "Content Missing!"
        })
    }
    const note = {
        id: generateId(),
        content: body.content,
        important: Boolean(body.important) || false
    }
    notes = notes.concat(note)
    res.json(note)
})
app.use(unknownEndpoint)

app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
})