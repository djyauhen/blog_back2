const ArticleModel = require('../models/articles.model');
const config = require('../config/config');

const handleError = (res, error) => {
    res.send(error.message);
}

class ArticleController {

    // Метод для получения всех статей
    static async getArticles(req, res) {
        try {
            const itemsPerPage = 6;
            const page = parseInt(req.query['page'], 10) || 1;
            let articlesData = await ArticleModel.getArticles();
            let articles = articlesData.articles;
            let articlesCount = articlesData.articlesCount;
            articles = articles.slice(itemsPerPage * (page - 1), itemsPerPage * page);
            res.status(200).json({
                totalCount: articlesCount,
                pages: Math.ceil(articlesCount / itemsPerPage),
                articles: articles
            });
        } catch (error) {
            handleError(res, error);
        }
    }

    // Метод для получения статьи по ID
    static async getArticle(req, res) {
        try {
            const id = req.params.id;
            const article = await ArticleModel.getArticleByID(id);
            res.status(200).json(article);
        } catch (error) {
            handleError(res, error);
        }
    }

    //Добавление статьи
    static async addArticle(req, res) {
        try {
            let imageUrl;
            if (req.file) {
                imageUrl = `${config.url}public/${req.file.filename}`;
            } else {
                imageUrl = '';
            }

            const data = {
                title: req.body.title,
                text: req.body.text,
                duration: Number(req.body.duration),
                image: imageUrl
            }

            const article = await ArticleModel.addNewArticle(data);
            res.status(200)
                .json(article);
        } catch (error) {
            handleError(res, error);
        }
    }

    //Удаление статьи
    static async deleteArticle(req, res) {
        try {
            const id = req.params.id;
            const operation = await ArticleModel.deleteArticleById(id);
            res.status(200).json(operation);
        } catch (error) {
            handleError(res, error);
        }
    }

    static async updateArticle(req, res) {
        try {
            const id = req.params.id
            let data;
            if (req.file && !req.body.imageDelete) {
                data = {
                    title: req.body.title,
                    text: req.body.text,
                    duration: Number(req.body.duration),
                    image: `${config.url}public/${req.file.filename}`
                }
            } else if (!req.file && req.body.imageDelete && (req.body.imageDelete === 'true')) {
                data = {
                    title: req.body.title,
                    text: req.body.text,
                    duration: Number(req.body.duration),
                    image: ''
                }
            } else if (!req.file && (req.body.imageDelete !== 'true')) {
                data = {
                    title: req.body.title,
                    text: req.body.text,
                    duration: Number(req.body.duration)
                }
            }
            const articleUpdate = await ArticleModel.updateArticleById(id, data);
            res.status(200).json(articleUpdate);
        } catch (error) {
            handleError(res, error);
        }
    }

}

module.exports = ArticleController;