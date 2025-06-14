describe('Check routes', () => {
  it('Can view the Home page', () => {
    cy.visit('/');
    cy.contains('StuConnect');
  });

  it('Can view the Login page', () => {
    cy.visit('/Login');
    cy.contains('Log In');
  });

  it('Can view the Sign up page', () => {
    cy.visit('/Signup');
    cy.contains('Sign Up');
  });

  // it('Can view the Discovery page', () => {
  //   cy.visit('/Discovery');
  //   cy.get('Tab[value="Discovery"]').should('exist');
  //   cy.get('Tab[value="Discovery"]').should('have.prop', 'aria-selected', true);
  //   cy.get('Tab[value="Connections"]').should('exist');
  //   cy.get('Tab[value="Connections"]').should('have.prop', 'aria-selected', false);
  // });
});

//checking if all fields are visible for signin
describe('Sign In Form Tests', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display the email and password fields', () => {
    cy.contains('Email').should('be.visible');

    cy.contains('Password').should('be.visible');
  });
});
//checking if all fields are visible for signup
describe('Sign Up Form Tests', () => {
  beforeEach(() => {
    cy.visit('/Signup');
  });

  it('should display the full name, email and password fields', () => {
    // cy.contains('First Name').should('be.visible');
    // cy.contains('Last Name').should('be.visible');
    cy.contains('Email').should('be.visible');
    cy.contains('Password').should('be.visible');
  });
});

describe('Sign Up Error Handling', () => {
  it('Displays error messages for invalid or incomplete sign-up attempts', () => {
    // Visit the sign-up page URL
    cy.visit('/Signup');

    // Check if the sign-up form is present
    cy.contains('h2', 'StuConnect Sign Up').should('be.visible');

    // Attempt to sign up with an already registered email or invalid details
    cy.get('input[name="email"]').type('existinguser@example.com');
    cy.get('input[name="password"]').type('short');

    // Click the 'Join' button to submit the form
    cy.get('.sign-up-btn').click();

    cy.contains('.error-message', 'Email is already in use').should(
      'be.visible',
    );
    cy.contains(
      '.error-message',
      'Password must be at least 6 characters long',
    ).should('be.visible');
  });
});
