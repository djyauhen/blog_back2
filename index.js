const express = require('express');
const cors = require('cors');
const fs = require('fs');
const MongoDBConnection = require("./src/utils/common/connections");
const path = require("path");
const config = require("./src/config/config");
const articleRoutes = require('./src/routes/articles.routes');
const TelegramAPI = require('node-telegram-bot-api');
const token = '7182522870:AAEe1W-UUYKonFPLk6EmG3vvLiwNxYuXY94';
const bot = new TelegramAPI(token, {polling: true});

MongoDBConnection.getConnection((error, connection) => {
    if (error || !connection) {
        console.log('Db connection error', error);
        return;
    }
    const app = express();
    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(cors());
    app.use("/api/articles", articleRoutes);
    app.get('/public/:image', (req, res) => {
        const imageName = req.params.image;
        const imagePath = path.join(__dirname, 'public', imageName);
        // Чтение файла и отправка в ответ
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.header('Content-Type', 'image/jpeg');
                res.send(data);
            }
        });
    });
    app.post("/api/send-message", async (req, res) => {
        const handleError = (res, error) => {
            res.send(error.message);
        }
        try {
            const {name, phone, question} = req.body;
            const svetlanaId = 1082531680;
            const devId = 1069494391;

            const result = await bot.sendMessage(devId, `Светлана, здравствуйте!
 Вам новое сообщение!
 От: ${name}
 Номер телефона: +7${phone}
 Вопрос: ${question}`);

            res.status(200).json({msg: 'OK'});
        } catch (error) {
            handleError(res, error);
        }
    });
    // app.get('*', function(req, res) {
    //     res.sendFile(path.join(__dirname, 'browser', 'index.html'));
    // });
    app.use(function (req, res, next) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    app.use(function (err, req, res, next) {
        res.status(err.statusCode || 500).send({error: true, message: err.message});
    });

    app.listen(config.port, config.host, () =>
        console.log(`Server started on http://${config.host}:${config.port}`)
        );
})
