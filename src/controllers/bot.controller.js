const config = require('../config/config');



class BotController {

    // Метод для отправки сообщения
    static async sendMessage(req, res) {
        try {
            if (req) res.status(200).json({msg: 'Привет'});
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = BotController;