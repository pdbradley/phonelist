import PhoneNumberFormatter from 'phone-number-formats';

export function formatPhone(phone: string | number) {
  const ph = phone.toString();
  if (!ph) return '';

  try {
    return new PhoneNumberFormatter(ph).format({ type: 'domestic' }).toString();
  } catch (e) {
    return phone.toString();
  }
}

export function phoneDigits(phone: string) {
  return phone ? phone.replace(/[^\d]/g, '') : '';
}

export function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase();
}
