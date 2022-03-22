/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { ROUTES } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
    });
    test("Then bills should be ordered from earliest to latest", () => {
      // Array sort Bills by date descendent
      const html = BillsUI({
        data: bills.sort((a, b) => new Date(b.date) - new Date(a.date)),
      });
      document.body.innerHTML = html;
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });

  /* Etant donné que je suis connecté comme un employé :
  Quand je clique sur le bouton new bills
  Il doit afficher la page de new bills */

  describe("When I click on new bill button", () => {
    test("Then function handleClickNewBill is called and I navigate to new bill page", () => {
      const html = BillsUI({ data: [] });
      document.body.innerHTML = html;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const bill = new Bills({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage,
      });
      const handleClickNewBill = jest.fn(bill.handleClickNewBill);
      const btnNewBill = screen.getByTestId("btn-new-bill");
      btnNewBill.addEventListener("click", handleClickNewBill);
      userEvent.click(btnNewBill);
      expect(handleClickNewBill).toHaveBeenCalled();
    });
  });

  /* Quand je clique sur le bouton voir
  Il doit afficher la modale du justifcatif */

  describe("when I click on the eye button", () => {
    test("it should display the justificate modal", () => {
      $.fn.modal = jest.fn();
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const bill = new Bills({
        document,
        onNavigate,
        firestore: null,
        localStorage: null,
      });

      const iconEye = screen.getAllByTestId("icon-eye");
      const handleClickIconEye = jest.fn(bill.handleClickIconEye(iconEye[1]));

      iconEye[1].addEventListener("click", handleClickIconEye);
      userEvent.click(iconEye[1]);
      expect(handleClickIconEye).toHaveBeenCalled();
      const modale = document.getElementById("modaleFile");
      expect(modale).toBeTruthy();
    });
  });
});
