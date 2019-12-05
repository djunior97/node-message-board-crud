const express = require('express');

const server = express();

server.use(express.json());

const messages = [];

// Middleware para chegar se o ID descrito no body existe dentro de messages
function checkIfMessageExists(req, res, next) {
    const {id} = req.params;

    const message = messages.find(e => e.id == id);

    if (!message) {
        return res.status(400).json({error: 'The given ID does not exists in Messages'});
    }

    return next();
}

server.get('/messages', (req, res) => res.json(messages));

server.post('/messages', (req, res) => {
    const {title, content} = req.body,
          id = messages.length + 1;

    const newProject = {
        id,
        title,
        content
    };

    messages.push(newProject);

    return res.json(messages)
})

server.put('/messages/:id', checkIfMessageExists, (req, res) => {
    const {id} = req.params;
    const message = messages.find(e => e.id == id);
    const obj = req.body;

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            message[key] = obj[key];
        }
    }

    return res.json(messages);
})

server.delete('/messages/:id', checkIfMessageExists, (req, res) => {
    const {id} = req.params;
    const index = messages.findIndex(e => e.id == id); 

    messages.splice(index, 1);

    return res.json(messages);
})

server.listen(3030);