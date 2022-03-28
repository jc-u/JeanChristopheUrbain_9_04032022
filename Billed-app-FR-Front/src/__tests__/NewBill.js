/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import BillsUI from "../views/BillsUI.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";
import store from "../__mocks__/store";

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
        store: store,
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

// test d'intégration POST
describe("Given I am a user connected as Employee", () => {
  describe("When I create new bill", () => {
    test("send bill to mock API POST", async () => {
      localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "a@a" })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.NewBill);
      jest.spyOn(mockStore, "bills");

      mockStore.bills.mockImplementationOnce(() => {
        return {
          create: (bill) => {
            return Promise.resolve();
          },
        };
      });

      await new Promise(process.nextTick);
      expect(screen.getByText("Mes notes de frais")).toBeTruthy();
    });
    describe("When an error occurs on API", () => {
      test("send bill to mock API POST", async () => {
        localStorage.setItem(
          "user",
          JSON.stringify({ type: "Employee", email: "a@a" })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        router();
        window.onNavigate(ROUTES_PATH.NewBill);
        jest.spyOn(mockStore, "bills");

        mockStore.bills.mockImplementationOnce(() => {
          return {
            create: (bill) => {
              return Promise.reject(new Error("Erreur 404"));
            },
          };
        });

        await new Promise(process.nextTick);
        const html = BillsUI({ error: "Erreur 404" });
        document.body.innerHTML = html;
        const message = await screen.getByText(/Erreur 404/);
        expect(message).toBeTruthy();
      });
      test("send bill to mock API POST", async () => {
        localStorage.setItem(
          "user",
          JSON.stringify({ type: "Employee", email: "a@a" })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        router();
        window.onNavigate(ROUTES_PATH.NewBill);
        jest.spyOn(mockStore, "bills");

        mockStore.bills.mockImplementationOnce(() => {
          return {
            create: (bill) => {
              return Promise.reject(new Error("Erreur 500"));
            },
          };
        });

        await new Promise(process.nextTick);
        const html = BillsUI({ error: "Erreur 500" });
        document.body.innerHTML = html;
        const message = await screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      });
    });
  });
});
