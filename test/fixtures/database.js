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

function resetTable(done) {
  knex.schema.dropTableIfExists('authors')
  .then(function () {
    return knex.schema.createTable('authors', function (table) {
      table.engine('InnoDB');
      table.timestamps();
      table.charset('utf8');
      table.increments('id').primary();
      table.string('long_name');
      table.string('short_name');
      table.string('origin');
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
      origin: 'L\'homme le plus classe du monde2'
    });
  })
  .exec(function () {
    knex.schema.dropTableIfExists('users')
    .then(function () {
      return knex.schema.createTable('users', function (table) {
        table.increments('id').primary();
        table.string('email').notNullable().unique();
        table.string('password', 60).notNullable();
        table.string('first_name');
        table.string('last_name');
        table.integer('current_role_id').index();
        table.integer('current_section_id').index();
      });
    })
    .exec(done);
  });
}

exports.User = User;
exports.Author = Author;
exports.reset = resetTable;