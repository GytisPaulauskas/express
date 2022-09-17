const express = require('express');

const server = new express();

// Middleware
server.use(express.json());

// Duomenu baze
const database = {
    dadJokes: [
        {
            id: 1,
            question: 'Koks megstamiausias Bethoveno vaisius ?',
            punchline: 'Ba-Na-Na-Na... Ba-Na-Na-Na...',
        },
        {
            id: 2,
            question: 'Kokioje šalyje daugiausiai veganu ?',
            punchline: 'cu-Kinijoje',
        }
    ]
};

let currentId = 2
const createId = () => ++currentId;

const isValidJokeData = ({ question, punchline }) => (
    question !== undefined && typeof question === 'string' && question !== '' &&
    punchline !== undefined && typeof punchline === 'string' && punchline !== ''
)

const createCmpById = (dadJokeIdStr) => ({ id }) => id === Number(dadJokeIdStr);

const findDadJoke = (dadJokeIdStr) => database.dadJokes.find(createCmpById(dadJokeIdStr))

// GET | /dad-jokes
server.get('/dad-jokes', (req, res) => {
    res.status(200).json(database.dadJokes)
});

// GET | /dad-jokes/:id
server.get('/dad-jokes/:id', (req, res) => {
    const dadJokeId = req.params.id;

    try {
        const foundDadJoke = findDadJoke(dadJokeId);
        if (foundDadJoke === undefined) throw ({
            message: 'Nerastas bairis',
            status: 404
        });

        res.status(200).json(foundDadJoke);
    } catch ({ status, message }) {
        res.status(status).json({ message });
    }
});

// POST | /dad-jokes/:id
server.post('/dad-jokes', (req, res) => {
    const newDadJokeData = req.body;

    try {
        if (!isValidJokeData(newDadJokeData)) throw ({
            message: 'Neteisingi duomenys',
            status: 400
        });

        const newDadJoke = {
            id: createId(),
            ...newDadJokeData,
        }

        database.dadJokes.push(newDadJoke);

        res.status(201).json(newDadJoke)

    } catch ({ status, message }) {
        res.status(status).json({ message });
    }
});

// PUT | /dad-jokes/:id

// PATCH | /dad-jokes/:id
server.patch('/dad-jokes/:id', (req, res) => {
    const dadJokeId = req.params.id;
    const newDadJokeData = req.body;

    try {
        if (!isValidJokeData(newDadJokeData)) throw ({
            message: 'Neteisingi duomenys',
            status: 400
        });
        const existingDadJoke = database.dadJokes.find(x => x.id === Number(dadJokeId))
        if (existingDadJoke === undefined) throw ({
            message: 'Klaida, nerastas bajeris',
            status: 404
        });

        existingDadJoke.punchline = newDadJokeData.punchline;
        existingDadJoke.question = newDadJokeData.question;

        res.status(200).json(existingDadJoke)

    } catch ({ status, message }) {
        res.status(status).json({ message });
    }
})


// DELETE | /dad-jokes/:id

server.listen(2566, (err) => {
    if (err) {
        console.error('Serverio paleidimo klaida');
    }

    console.log(`serveris veikia ant http://localhost:2566`);
});