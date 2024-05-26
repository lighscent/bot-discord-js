const client = require('./client');
require('dotenv').config();

require('./db')
require('./handlers/events');


client.login(process.env.DISCORD_TOKEN);