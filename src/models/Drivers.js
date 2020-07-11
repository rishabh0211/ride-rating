const {
  Model
} = require('objection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class Drivers extends Model {
  static get tableName() {
    return 'drivers';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['firstname', 'email', 'password_hash'],
      properties: {
        id: {
          type: 'integer'
        },
        firstname: {
          type: 'string'
        },
        lastname: {
          type: 'string'
        },
        email: {
          type: 'string'
        },
        passwordhash: {
          type: 'string'
        },
        mobile: {
          type: 'string'
        },
        token: {
          type: 'string'
        }
      }
    };
  }

  async $beforeInsert() {
    const driver = this;
    driver.password_hash = await bcrypt.hash(driver.password_hash, 8);
  }

  toJSON() {
    const driver = this;
    delete driver.password_hash;
    return driver;
  }

  async generateAuthToken() {
    const driver = this;
    const token = jwt.sign({
      id: driver.id,
    }, process.env.JWT_SECRET_KEY);
    await Drivers.query()
      .findById(driver.id)
      .patch({
        token
      });
    return token;
  }

}

module.exports = Drivers;
