var request = require('supertest');
var server = require('../server');
const { expect } = require('chai');
let mqttclient = require('../router/mqtt');

describe('GET /stu/v1', function() {
  describe('GET /stu/v1/data', function() {
    it('respond with a room status', function(done) {
      request(server)
        .get('/stu/v1/update?msg=Update?nl=32400&&nr=32400')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.body.result[0].id).to.equal('2001');
          done();
        });
    });
  });
});

// describe('test mqtt', function() {
//   it('respond with a room status', function(done) {
//     const pool = {
//       status: 'ok',
//       data: [
//         {
//           n: '1'
//         }
//       ]
//     };
//     mqttclient.publish('pool', pool);

//   });
// });
