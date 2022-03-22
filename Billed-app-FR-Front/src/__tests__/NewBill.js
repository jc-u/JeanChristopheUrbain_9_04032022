/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { ROUTES } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import mockStore from "../__mocks__/store";

jest.mock("../app/store", () => mockStore);

// Etant donné que je suis connecté comme un employé :

describe("Given I am connected as an employee", () => {
  /* Quand je suis sur la page new bills et que je seclectionne un fichier de justificatif
Il doit changer d'input et doit corrrespondre à une extension jpeg, png ou pdf*/

  describe("When I am on NewBill Page and I select a file as justificatif", () => {
    test("Then the input will change", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const html = NewBillUI();
      document.body.innerHTML = html;

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });

      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const btnFile = screen.getByTestId("file");

      btnFile.addEventListener("change", handleChangeFile);

      const file = new File(["test.png"], "test.png", { type: "image/png" });
      fireEvent.change(btnFile, {
        target: {
          files: [file],
        },
      });

      expect(handleChangeFile).toHaveBeenCalled();
      expect(btnFile.files[0].name).toBe("test.png");
      //to-do write assertion
    });
  });

  /* Quand je suis sur la page new bill et que je clique sur le bouton envoyer
Une new bill est créée */

  describe("when I am on NewBill Page and I click on submit button", () => {
    test("a new bill is created", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage,
      });

      const handleSubmit = jest.fn(newBill.handleSubmit);
      const submit = screen.getByTestId("form-new-bill");

      submit.addEventListener("submit", handleSubmit);
      fireEvent.submit(submit);

      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
