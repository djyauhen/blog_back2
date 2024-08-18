const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Создаем схему
const articleSchema = new Schema({
    title: {type: String, required: true},
    text: {type: String, required: true},
    image: {type: String, required: false},
    date: {type: String, required: true},
    duration: {type: Number, required: true},
})
const ArticleSchema = mongoose.model('Article', articleSchema, 'articles');

class ArticleModel {

    //Получаем все статьи
    static async getArticles() {
        try {
            const articles = await ArticleSchema.find({});
            const articlesCount = await ArticleSchema.countDocuments();
            return {articles, articlesCount};
        } catch (error) {
            throw error
        }
    }

    //Получаем статью по ID
    static async getArticleByID(id) {
        try {
            const article = await ArticleSchema.findOne({_id: id});
            return article;
        } catch (error) {
            throw error
        }
    }

    //Создаем статью
    static async addNewArticle(data) {
        try {
            const date = new Date().toLocaleDateString('ru-RU');
            const {title, text, duration, image} = data
            const newArticle = new ArticleSchema({
                title: title,
                text: text,
                duration: duration,
                image: image,
                date: date
            });
            await newArticle.save();
            return newArticle;
        } catch (error) {
            throw error;
        }
    }

    //Удаления статьи
    static async deleteArticleById(articleId) {
        try {
            const res = await ArticleSchema.findOneAndDelete({_id: articleId});
            return res ? res : "Статья не найдена";
        } catch (error) {
            throw error;
        }
    }

    //Изменеия статьи
    static async updateArticleById(articleId, data) {
        try {
            const {title, text, duration, image} = data
            const article = await ArticleSchema.findOneAndUpdate({_id: articleId}, {
                title,
                text,
                duration,
                image
            }, {new: true});
            return article ? article : "Статья не найдена";
        } catch (error) {
            throw error;
        }
    }

}

module.exports = ArticleModel;