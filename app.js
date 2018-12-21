let express = require('express');
let http = require('http');
let path = require('path');
let mongoose = require('mongoose');

let app = express();

mongoose.connect("mongodb://localhost/myapp");

let UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
let User = mongoose.model('users', UserSchema); //оздание модели (коллекция в бд)

app.configure(function () {
    app.use(express.bodyParser()); //для обработки post-запросов (req.body)
    app.use(express.cookieParser('Authentication Tutorial ')); // промежуточная обработка для синтаксического анализа cookie
    app.use(express.session()); // поддержка сессий

    // Для предоставления статических файлов, например, изображений, файлов CSS и
    //JavaScript в Express используется функция промежуточной обработки express.static.
    app.use(express.static(path.join(__dirname, 'public')));
    app.use("/styles", express.static(__dirname + '/styles'));
    app.use('/script', express.static(__dirname + '/script'));
    app.use("/resources/image", express.static(__dirname + '/resources/image'));
    app.use("/resources/fonts", express.static(__dirname + '/resources/fonts'));
    app.use("/resources/video", express.static(__dirname + '/resources/video'));
    app.use("/resources/data", express.static(__dirname + '/resources/data'));
    app.set('/views', express.static(__dirname + '/views'));
    app.set('view engine', 'ejs');
});

app.use(function (req, res, next) { //промежуточный обработчик. Получение данных из запроса
    // ф-ия вып при каждом получении запроса приложением (не указ. uri)
    let err = req.session.error;
    let msg = req.session.success;
    let usr = req.session.user;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    res.locals.currentUser = '';
    if (err) res.locals.message = err;
    if (msg) res.locals.message = msg;
    if (usr) res.locals.currentUser = usr.username;
    next();
});

function authenticate(name, pass, fn) {
    User.findOne({ // поиск по username
            username: name
        },
        function (err, user) {
            if (user) {
                if (err) return fn(new Error('Пользователь не найден'));
                if (pass === user.password) return fn(null, user);
                fn(new Error('Некорректный пароль'));
            } else {
                return fn(new Error('Пользователь не найден'));
            }
        });
}

function userExist(req, res, next) {
    User.count({
        username: req.body.username
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
            req.session.error = "Пользователь с таким именем уже существует";
            res.redirect("/"); // перенаправление ответа
        }
    });
}

app.post("/signup", userExist, function (req, res) {
    let password = req.body.password;
    let username = req.body.username;

    let user = new User({
        username: username,
        password: password
    }).save(function (err, newUser) { //сохранение в бд
        if (err) throw err;
        authenticate(newUser.username, password, function (err, user) { // сразу же аутентификация
            if (user) {
                req.session.regenerate(function () {
                    req.session.user = user; // здесь уже новая сессия
                    res.redirect('/'); // перенапр. ответа
                });
            }
        });
    });
});

app.post("/login", function (req, res) {
    authenticate(req.body.username, req.body.password, function (err, user) {
        if (user) {
            req.session.regenerate(function () {
                req.session.user = user;
                res.redirect('/');
            });
        } else {
            req.session.error = 'Неправильный логин или пароль';
            res.redirect('/');
        }
    });
});

app.get('/logout', function (req, res) {
    req.session.destroy(function () {
        res.redirect('/');
    });
});

app.get("/", function (req, res) {
    if (req.session.user)
        res.locals.user = req.session.user;
    res.render("index"); // вывод шаблона представления
});

app.get("/teams", function (req, res) {
    if (req.session.user)
        res.locals.user = req.session.user;
    res.render("teams");
});

app.get("/players", function (req, res) {
    if (req.session.user)
        res.locals.user = req.session.user;
    res.render("players");
});

app.get("/history", function (req, res) {
    if (req.session.user)
        res.locals.user = req.session.user;
    res.render("history");
});

app.get("/schedule", function (req, res) {
    if (req.session.user)
        res.locals.user = req.session.user;
    res.render("schedule");
});

http.createServer(app).listen(3000);