import { formatPhone } from './utils';

export interface ContactDetails {
  name: string;
  mobile: string;
  home: string;
  email: string;
}

export class Contact implements ContactDetails {
  name = '';
  private _mobile = '';
  private _home = '';
  email = '';

  constructor(contact: Partial<ContactDetails>) {
    Object.assign(this, contact);
  }

  get phone() {
    return this.mobile || this.home || '';
  }

  get mobile() {
    return this._mobile ? formatPhone(this._mobile) : '';
  }

  set mobile(value: string) {
    this._mobile = value;
  }

  get home() {
    return this._home ? formatPhone(this._home) : '';
  }

  set home(value: string) {
    this._home = value;
  }

  get id() {
    return `${this.name}-${this.phone}`;
  }
}

export const allContacts = [] as Contact[];

export function addContacts(conts: Contact[], dontSave?: boolean) {
  conts.forEach((c) => allContacts.push(new Contact(c)));
  if (!dontSave) saveContacts();
}

const KEY = 'contacts';
function saveContacts() {
  window.sessionStorage.setItem(KEY, JSON.stringify(allContacts));
}

function restoreContacts() {
  const data = window.sessionStorage.getItem(KEY);
  if (data) {
    try {
      const json: Contact[] = JSON.parse(data);
      addContacts(json, true);
    } catch (e) {}
  }
}

restoreContacts();
