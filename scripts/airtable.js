require('dotenv-flow').config();
const fs = require('fs');
const util = require('util');
const path = require('path');
const Airtable = require('airtable');
const writeFile = util.promisify(fs.writeFile);

const DRY_RUN = false;

const OUT_FILE = path.join(__dirname, '..', 'functions', 'contacts.json');

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } = process.env;

if (!AIRTABLE_API_KEY) {
  console.error('AIRTABLE_API_KEY not set');
  process.exit(1);
}

if (!AIRTABLE_BASE_ID) {
  console.error('AIRTABLE_BASE_ID not set');
  process.exit(1);
}

if (!AIRTABLE_TABLE_NAME) {
  console.error('AIRTABLE_TABLE_NAME not set');
  process.exit(1);
}

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: AIRTABLE_API_KEY,
});

async function getAirtable(_event, _context) {
  const base = Airtable.base(AIRTABLE_BASE_ID);

  const records = await base(AIRTABLE_TABLE_NAME)
    .select({
      view: 'Grid view',
      filterByFormula:
        'AND({Verified}, {Over 18} = "Yes", OR({Mobile Phone}, {Home Phone}, {Email}))',
    })
    .all();

  const data = records.map((r) => {
    const firstName = r.get('First Name') || '';
    const lastName = r.get('Last Name') || '';
    const name = `${firstName} ${lastName}`;

    let mobile = (r.get('Mobile Phone') || '').replace(/\D/g, '');
    let home = (r.get('Home Phone') || '').replace(/\D/g, '');
    let email = r.get('Email') || '';

    let hall = r.get('Hall') || '';
    hall = hall.split(' ')[1] || '';

    return {
      name,
      mobile,
      home,
      email,
      hall,
    };
  });

  return data.sort((a, b) => {
    const A = a.name;
    const B = b.name;
    if (A < B) return -1;
    if (A > B) return 1;
    return 0;
  });
}

async function main() {
  try {
    const data = await getAirtable();

    if (DRY_RUN) console.log(JSON.stringify(data, null, '  '));
    else {
      await writeFile(OUT_FILE, JSON.stringify({ data }), {
        flag: 'w',
      });
    }

    console.log('Updated phonelist.', data.length, 'entries.');
    console.log('File:', OUT_FILE);
  } catch (err) {
    console.error(err);
  }
}

main();
