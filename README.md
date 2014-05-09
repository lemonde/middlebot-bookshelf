# middlebot-bookshelf
[![Build Status](https://travis-ci.org/lemonde/middlebot-bookshelf.svg?branch=master)](https://travis-ci.org/lemonde/middlebot-bookshelf)
[![Dependency Status](https://david-dm.org/lemonde/middlebot-bookshelf.svg?theme=shields.io)](https://david-dm.org/lemonde/middlebot-bookshelf)
[![devDependency Status](https://david-dm.org/lemonde/middlebot-bookshelf/dev-status.svg?theme=shields.io)](https://david-dm.org/lemonde/middlebot-bookshelf#info=devDependencies)

Collection of bookshelf middlewares.

## Install

```
npm install middlebot-bookshelf
```

## Usage

### create, destroy, search, find, findAll

Resource methods, make operation in the database.

### snakeCaseKeys, camelizeKeys

Generic formatter to format an object on req.

```js
app.use(snakeCaseKeys({ key: 'query' })); // Will snakeCasify "req.query" object keys.
```

### formatFindOptions, formatFindAllOptions

Format req.query into two separated object, `req.where` and `req.options`. These object are used in `find` and `findAll` middlewares.

### formatBackboneModel, formatBackboneCollection

Generic formatters to transform backbone model and backbone collection to simple object.

## License

MIT