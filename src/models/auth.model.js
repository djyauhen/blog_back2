const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
        user_name: {type: String, require: true},
        password: {type: String, require: true}
})

const UserSchema = mongoose.model('User', userSchema, 'user');

class UserModel {
    static async getUser(userClient) {
        try {
            const userFind = await UserSchema.findOne({user_name: userClient.username}, function(err, user) {
                if (err) {
                    console.error('Ошибка при поиске пользователя:', err);
                } else if (user) {
                   bcrypt.compare(userClient.password, user.password)
                } else {
                    console.log('Пользователь не найден');
                }
            });
            return userFind;
        } catch (error) {
            throw error
        }

    }
}

module.exports = UserModel;