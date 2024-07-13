import mongoose from "mongoose";

if (process.argv.length < 3) {
    console.log('give argument as password');
    process.exit()
}

const password = process.argv[2]

const url = `mongodb+srv://ishaanrana2635:${password}@cluster0.xa43ybs.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url);

//for finding data

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = new mongoose.model('Note', noteSchema)

Note.find({}).then(notes=>{
    notes.forEach(note => {
        console.log(note);
    })
    mongoose.connection.close()
})

//for saving data
/*

const note = new Note({
    content: 'Html is easy',
    important: true,
})

note.save()
    .then(req => {
        console.log('note Saved!');
        mongoose.connection.close()
    })
*/


