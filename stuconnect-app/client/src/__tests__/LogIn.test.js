// Author: Kripa Pokrel

//testing passwords
const passwords = [
  'Test123!', // valid
  'test1!', // missing uppercase
  'Test12', // missing special character
  '123456!', // missing letter
  'Test!', // too short
  'test123!', // missing uppercase
  'TEST123!', // missing lowercase (assuming it's a new requirement)
];

describe('Password Validation Criteria', () => {
  test('Passwords meet validation criteria', () => {
    passwords.forEach(password => {
      const hasSixCharacters = password.length >= 6;
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);

      //ideal password has at least one uppercase, special character, number and min 6 character
      if (password === 'Test123!') {
        expect(
          hasSixCharacters &&
            hasNumber &&
            hasSpecialChar &&
            hasUpperCase &&
            hasLowerCase,
        ).toBe(true);
      } else if (password === 'test1!') {
        expect(hasUpperCase).toBe(false);
      } else if (password === 'Test12') {
        expect(hasSpecialChar).toBe(false);
      } else if (password === '123456!') {
        expect(hasLowerCase || hasUpperCase).toBe(false);
      } else if (password === 'Test!') {
        expect(hasSixCharacters).toBe(false);
      } else if (password === 'test123!') {
        expect(hasUpperCase).toBe(false);
      } else if (password === 'TEST123!') {
        expect(hasLowerCase).toBe(false);
      }
    });
  });
});
