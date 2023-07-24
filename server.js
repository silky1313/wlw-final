const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: `${__dirname}/config.env` });

mongoose
  .connect(process.env.DATABASE_LOCAl, {
    useNewUrlParser: true
  })
  .then(con => {
    console.log('DB connection successful');
  });

const port = process.env.PORT || 8008;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
//test
