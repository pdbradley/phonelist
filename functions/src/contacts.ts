import Airtable from 'airtable';

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: 'keyAd9AgnkMtrEMJf',
} as any);

exports.handler = async function () {
  try {
    const base = Airtable.base('app6eilO3ieLlbdYA');

    const records = await base('Table 1')
      .select({
        view: 'Grid view',
        filterByFormula: '{Verified}',
      })
      .all();

    const data = records.map((r) => ({
      firstName: r.get('First Name') || '',
      lastName: r.get('Last Name') || '',
      mobilePhone: r.get('Mobile Phone') || '',
      homePhone: r.get('Home Phone') || '',
      email: r.get('Email') || '',
      verified: r.get('Verified') || false,
    }));

    const res = {
      statusCode: 200,
      body: JSON.stringify(data),
    };

    return res;
  } catch (err) {
    let error = 'Error';
    if (err && 'message' in err) error = err.message;

    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
