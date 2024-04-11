require('dotenv').config();
require('module-alias/register');

// require('@/seeds');

const bot = require('@/configs/bot');
const router = require('@/routes');
const store = require('@/store');
const { initStore } = require('@/store/utils');

router(bot);
const stores=async () =>await initStore(store);
stores()





console.log("\n Sniper bot is running... \n");