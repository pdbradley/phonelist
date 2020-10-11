require('dotenv-flow').config();
const fs = require('fs');
const util = require('util');
const path = require('path');
const writeFile = util.promisify(fs.writeFile);

const OUT_FILE = path.join(__dirname, '..', 'functions', 'pins.json');

async function main() {
  try {
    const pins = process.env.PINS;

    await writeFile(OUT_FILE, JSON.stringify(pins), {
      flag: 'w',
    });

    console.log('Created pins', OUT_FILE);
  } catch (err) {
    console.error(err);
  }
}

main();
