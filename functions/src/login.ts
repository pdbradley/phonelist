import { APIGatewayEvent } from 'aws-lambda';
import contacts from '../contacts.json';
import pins from '../pins.json';

const PINS = (pins || process.env.PINS || '').split(',');

export const handler = async function (event: APIGatewayEvent) {
  let body: any = '';

  try {
    const json = JSON.parse(event.body!);
    const pin = json.pin.toString().trim();

    if (PINS.includes(pin)) {
      body = contacts;
    } else {
      body = { error: 'Invalid Pin' };
    }
  } catch (err) {
    body = { error: 'Error. Please try again.' };
  }

  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  };
};
