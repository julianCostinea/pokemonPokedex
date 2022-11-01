/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable jest/no-export */
/* eslint-disable jest/expect-expect */
export {};
/// <reference types="cypress" />

describe("example to-do app", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("displays at least five pokemon in other pokemon field", () => {
    cy.get("h2").contains("Who's that pokemon?").should("be.visible");
    cy.getByTestId("multiplePokemonContainer").children().should("have.length.at.least", 5)
  });

  it("shows error if pokemon field is empty", () => {
    cy.get("button").click();
    cy.contains("Enter a valid pokemon name").should("be.visible");
  });
  it("shows correct pokemon type on pokemon input", () => {
    cy.get('input[type="text"]').type("bulbasaur");
    cy.get("button").click();
    cy.contains("grass").should("be.visible");
  });
  it("mocked shows correct pokemon type on pokemon input", () => {
    cy.intercept("GET", "https://pokeapi.co/api/v2/pokemon/bulbasaur", { fixture: "singlePokemon.json" })
    cy.get('input[type="text"]').type("bulbasaur");
    cy.get("button").click();
    cy.contains("grass").should("be.visible");
  });
  it("displays at least two pokemon in other pokemon field", () => {
    cy.intercept("GET", "https://pokeapi.co/api/v2/pokemon?limit=151", { fixture: "otherPokemon.json" })
    cy.getByTestId("multiplePokemonContainer").children().should("have.length", 2)
  });
});
