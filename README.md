# middlebot-bookshelf
[![Build Status](https://travis-ci.org/lemonde/middlebot-bookshelf.svg?branch=master)](https://travis-ci.org/lemonde/middlebot-bookshelf)
[![Dependency Status](https://david-dm.org/lemonde/middlebot-bookshelf.svg?theme=shields.io)](https://david-dm.org/lemonde/middlebot-bookshelf)
[![devDependency Status](https://david-dm.org/lemonde/middlebot-bookshelf/dev-status.svg?theme=shields.io)](https://david-dm.org/lemonde/middlebot-bookshelf#info=devDependencies)

Collection of bookshelf middlewares.

## Install

```
npm install https://github.com/lemonde/middlebot-bookshelf.git
```

## Usage

### create, destroy, find, findAll

Resource methods, make operation in the database.

### middelbotBookshelf.checkNotExist(options)

Test if a row doesn’t exist (unicity).

### Options

- `Model` model
- `string|string[]|function` where
- If a string or an array of string is provided, use `req.body` to find key. The function have `req` and `res` as arguments and must return a `where` expression.
- `boolean` strict if true, an error is returned is a where key is missing from the body

### Example

```js
app.use(middelbotBookshelf.checkNotExist({
    model: Author,
    where: 'userId'
  });
);
```

### middelbotBookshelf.checkExist(options)

Test if a row exists.

### Options

- `Model` model
- `string|string[]|function` where
- If a string or an array of string is provided, use `req.body` to find key. The function have `req` and `res` as arguments and must return a `where` expression.
- `boolean` strict if true, an error is returned is a where key is missing from the body

### Example

```js
app.use(middelbotBookshelf.checkExist({
    model: Author,
    keys: function (req, res) {
      return {
        id: req.query.id,
      };
    },
    error: new Error('Author doesn\'t exist.')
  });
);
```

## License

MIT
