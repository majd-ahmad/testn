import moment from 'moment';

export function generateSixDigitCode(digitsNumber: number): string {
  let code = '';
  for (let i = 0; i < digitsNumber; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

export function isCodeStillValid(codeCreatedAt: Date) {
  const codeValidUntil = moment(codeCreatedAt).add(15, 'm').toDate();
  if (new Date(Date.now()) > codeValidUntil) return false;
  return true;
}
