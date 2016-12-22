var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

var User = sequelize.define('user', {
    email: Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);

// ...sync({force: true})...
sequelize.sync().then(function () {
    console.log('Everything is synced');
    
    User.create({
        email: 'otello@example.com'
    }).then(function () {
        return Todo.create({
            descripton: 'Clean yard'
        });
    }).then(function (todo) {
        User.findById(1).then(function (user) {
            user.addTodo(todo);
        });
    })
});