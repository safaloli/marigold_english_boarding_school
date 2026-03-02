const { DBConfig } = require("./app.config");

module.exports = {
  development: {
    url: DBConfig.pg.url,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
  },
  test: {
    url: DBConfig.pg.url,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
  },
  production: {
    url: DBConfig.pg.url,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
  },
};