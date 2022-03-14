/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";

// Etant donné que je suis connecté comme un employé :

describe("Given I am connected as an employee", () => {
  /* Quand je suis sur la page new billset que je seclectionne un fichier de justificatif
Il doit changer d'input et doit corrrespondre à une extension jpeg, png ou pdf*/

  describe("When I am on NewBill Page and I select a file as justificatif", () => {
    test("Then the input will change", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      //to-do write assertion
    });
  });

  /* Quand je suis sur la page new bill et que je clique sur le bouton envoyer
Une new bill est créée */

  describe("when I am on NewBill Page and I click on submit button", () => {
    test("a new bill is created", () => {});
  });
});
