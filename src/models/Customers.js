const {
  Model
} = require('objection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class Customers extends Model {
  static get tableName() {
    return 'customers';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['firstname', 'lastname', 'email'],
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
        password_hash: {
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
    const customer = this;
    customer.password_hash = await bcrypt.hash(customer.password_hash, 8);
  }

  toJSON() {
    const customer = this;
    delete customer.password_hash;
    return customer;
  }

  async generateAuthToken() {
    const customer = this;
    const token = jwt.sign({
      id: customer.id,
    }, process.env.JWT_SECRET_KEY);
    await Customers.query()
      .findById(customer.id)
      .patch({
        token
      });
    return token;
  }
}

module.exports = Customers;