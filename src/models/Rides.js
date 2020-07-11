const { Model } = require('objection');

class Rides extends Model {
  static get tableName() {
    return 'rides';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        driver_id: { type: 'string'},
        customer_id: { type: 'string'},
        ride_date: {type: 'string'},
        start_time: {type: 'string'},
        end_time: {type: 'string'},
        driver_rating: {type: 'string'},
        customer_rating: {type: 'string'}
      }
    };
  }

}

module.exports = Rides;