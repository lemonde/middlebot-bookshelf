var Bookshelf = require('bookshelf');
var bookshelf = Bookshelf.initialize({
  client: 'sqlite',
  connection: {
    filename: ':memory:'
  },
  pool: {
    max: 1
  }
});
var knex = bookshelf.knex;

var User = bookshelf.Model.extend({
  tableName: 'users'
});
var Author = bookshelf.Model.extend({
  tableName: 'authors',
  user: function() {
    return this.belongsTo(User, 'user_id');
  }
});

var ArticleAuthor = bookshelf.Model.extend({
  tableName: 'articles-authors'
});

function resetTable(done) {
  knex.schema.dropTableIfExists('authors')
  .then(function () {
    return knex.schema.dropTableIfExists('users')
  })
  .then(function () {
    return knex.schema.dropTableIfExists('articles-authors');
  })
  .then(function () {
    return knex.schema.createTable('users', function (table) {
      table.increments('id').primary();
      table.string('first_name');
    });
  })
  .then(function () {
    return knex.schema.createTable('authors', function (table) {
      table.engine('InnoDB');
      table.timestamps();
      table.charset('utf8');
      table.increments('id').primary();
      table.string('long_name');
      table.string('short_name');
      table.string('origin');
      table.integer('user_id');
    });
  })
  .then(function () {
    return knex.schema.createTable('articles-authors', function (table) {
      table.increments('id').primary();
      table.integer('article_id').unsigned().notNullable();
      table.integer('author_id').unsigned().notNullable();
    });
  })
  .then(function () {
    return ArticleAuthor.forge().save({
      article_id: 1,
      author_id: 1
    });
  })
  .then(function () {
    return ArticleAuthor.forge().save({
      article_id: 1,
      author_id: 2
    });
  })
  .then(function () {
    return User.forge().save({
      first_name: 'John'
    });
  })
  .then(function () {
    return Author.forge().save({
      long_name: 'George Abitbol',
      short_name: 'G.A.',
      origin: 'L\'homme le plus classe du monde'
    });
  })
  .then(function () {
    return Author.forge().save({
      long_name: 'George Abitbol2',
      short_name: 'G.A.2',
      origin: 'L\'homme le plus classe du monde2',
      user_id: 1
    });
  })
  .exec(done);
}

exports.User = User;
exports.Author = Author;
exports.ArticleAuthor = ArticleAuthor;
exports.reset = resetTable;
