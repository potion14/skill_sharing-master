
const {v4: uuidv4} = require('uuid');

describe('new_course_creation', () => {
    it('user can create new course', () => {
        //login
        cy.visit('http://localhost:3000/login-register');
        cy.get('input[id="usernameL"]').type('przemek')
        cy.get('input[id="email"]').type('przemek@gmail.com')
        cy.get('input[id="password"]').type('przemek123')
        cy.findByRole('button', { name: /login/i }).click()
        //click Add New course
        cy.findByRole('link', {  name: /add new course/i, timeout: 25000 }).click()
        //type title
        const title = uuidv4()
        cy.get('input[id="courseTitle"]').type(title);
        //choose visibility option
        cy.findByRole('button', {  name: /course visibility: everyone/i}).click()
        cy.wait(501)
        cy.findByText(/Authors/i, { force: true }).click({force: true})
        //Select Main Category
        cy.findByRole('button', {  name: /select main category/i}).click()
        cy.wait(501)
        cy.findByText(/programowanie/i).click({force: true})
        //Select SubCategory
        cy.findByRole('button', {  name: /select subcategory/i}).click()
        cy.wait(501)
        cy.findByText(/obiektowe/i).click({force: true})
        //press Add Course
        cy.findByRole('button', {  name: /add course/i}).click()
        //type chapter title
        cy.findByRole('textbox', {  name: /chapter title/i}).type(title)
        //type something in content
        cy.get('#form > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)').type(title)
        //select cocreator
        cy.findByRole('button', {  name: /select cocreator/i}).click()
        cy.wait(501)
        cy.findByText(/piotr@gmail.com/i).click({force: true})
        //press addchapter
        cy.findByRole('button', {  name: /add chapter/i}).click()
    });
});