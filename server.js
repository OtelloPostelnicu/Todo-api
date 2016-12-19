var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;

//var todos = [{
//    id: 1,
//    description: 'Work on todo app',
//    completed: false
//}, {
//    id: 2,
//    description: 'Go to market',
//    completed: false
//}, {
//    id: 3,
//    description: 'Learn Node.JS',
//    completed: true
//}];

app.use(bodyParser.json());

var todos = [];
var todoNextId = 1;

app.get('/', function (req, res) {
    res.send('Todo API Root');
});

app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + '!');
});

app.get('/todos', function (req, res) {
    res.json(todos);
});

app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var resp;
    for (var i=0; i < todos.length; i++) {
        if (todoId === todos[i].id) {
            resp = todos[i];
        }
    }
    if (resp) {
        res.json(resp);
    } else {
        res.status(404).send('Todo not found.');
    }
    //res.send('Asking for todo with id of ' + req.params.id)
});

app.post('/todos', function (req, res) {
    var body = req.body;
    body.id = todoNextId++;
    todos.push(body);
    
    console.log('Description: ' + body.description);
    
    res.json(body);
});