var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;
var _ = require('underscore');

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

// GET /todos?completed=true&q=work
app.get('/todos', function (req, res) {
    var queryParams = req.query;
    var filteredTodos = todos;
    
    if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
        filteredTodos = _.where(filteredTodos, {completed: true});
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        filteredTodos = _.where(filteredTodos, {completed: false});
    }
    
    if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
        filteredTodos = _.filter(filteredTodos, function(todo) {
            return todo.description.toLowerCase().indexOf(queryParams.q) > -1;
        });
    }
    
    res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var resp = _.findWhere(todos, {id: todoId});

    if (resp) {
        res.json(resp);
    } else {
        res.status(404).send('Todo not found.');
    }
    //res.send('Asking for todo with id of ' + req.params.id)
});

// POST /todos
app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');
    
    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }
    
    body.description = body.description.trim();
    body.id = todoNextId++;

    todos.push(body);
    
    res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var resp = _.findWhere(todos, {id: todoId});
    
    if(!resp) {
        res.status(404).json({"error": "no todo found with that id"});
    } else {
        todos = _.without(todos, resp);
        res.json(resp);
    }
});

// PUT /todos/:id
app.put('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var resp = _.findWhere(todos, {id: todoId});
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};
    
    if(!resp) {
        return res.status(404).send();
    }
    
    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    };
    
    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    };
    
    resp = _.extend(resp, validAttributes);
    res.json(resp);
});