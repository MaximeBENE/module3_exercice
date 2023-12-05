const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const articlesService = require("./articles.service");

class ArticlesController {

  async getAll(req, res, next) {
    try {
      const articles = await articlesService.getAll();
      res.json(articles);
    } catch (err) {
      next(err);
    }
    
  }

  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const article = await articlesService.get(id);
      if (!article) {
        throw new NotFoundError();
      }
      res.json(article);
    } catch (err) {
      next(err);
    }

  }

  async create(req, res, next) {
    try {
      const { title, content, user, state } = req.body;
      const userId = req.user._id;

      if (!title.trim() || !content.trim() || !state.trim()) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires." });
      }

      const articleData = {
        title,
        content,
        state,
        user: userId,
      };

      const article = await articlesService.create(articleData);
      req.io.emit("article:create", article);
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }

  }

  async update(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;

      if (req.user.role !== "admin") {
        throw new UnauthorizedError();
      }

      const articleModified = await articlesService.update(id, data);
      req.io.emit("article:update", articleModified);
      res.json(articleModified);
    } catch (err) {
      next(err);
    }

  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;

      if (req.user.role !== "admin") {
        throw new UnauthorizedError();
      }

      await articlesService.delete(id);
      req.io.emit("article:delete", { id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

}

module.exports = new ArticlesController();