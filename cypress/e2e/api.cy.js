/// <reference types="Cypress" />

describe('API Test Using Cypress', () => {
  it('Should show welcome message on default path', () => {
    cy.request('GET', 'http://localhost:3000')
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.length.above(0);
        expect(response.body).contain('Welcome')
      });
  })

  it('Should get items', () => {
    cy.request('GET', 'http://localhost:3000/getItems')
      .then((response) => { 
        expect(response.status).to.eq(200);
        expect(response.body.data.length).to.eq(3);
        expect(response.body.data[0].name).to.eq('Item 1');
      });
  })

  it('Should throw error when we call get users without token', () => {
    // "failOnStatusCode: false" is required to validate the error scenarios
    cy.request({url:'http://localhost:3000/getUsers', failOnStatusCode: false })
      .then((response) => { 
        expect(response.status).to.eq(401);
      });
  })

  it('Should return data when we call getUsers with token', () => {
    cy.request({url:'http://localhost:3000/getToken'}).then(res => {
      cy.setCookie("token", res.body)
    })
    cy.request({url:'http://localhost:3000/getUsers'})
      .then((response) => { 
        expect(response.status).to.eq(200);
        expect(response.body.data.length).to.eq(3);
        expect(response.body.data[0].name).to.eq('User 1');
      });
  })
})