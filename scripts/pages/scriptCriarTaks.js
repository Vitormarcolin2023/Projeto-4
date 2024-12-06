import { API_BASE_URL } from "../../config/apiConfig.js";
import { getFromLocalStorage } from "../utils/storage.js";

const recuperaUser = getFromLocalStorage("user");
const recuperaColumn = getFromLocalStorage("coluna");

function createTaks(taksData) {
  const endpoint = `${API_BASE_URL}/Task`;

  fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taksData),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw errorData;
        });
      }
      return response.json();
    })
    .then((data) => {
      telaPrincipal();
      console.log("Taks criada com sucesso:", data);
      document.getElementById("responseMessage").textContent =
        "Taks criada com sucesso!";
      document.getElementById("responseMessage").classList.remove("error");
      document.getElementById("responseMessage").classList.add("success");
    })
    .catch((errorData) => {
      console.error("Erro ao criar taks:", errorData);
      // Exibir a mensagem de erro
      if (errorData.Errors && errorData.Errors.length > 0) {
        document.getElementById("responseMessage").textContent =
          errorData.Errors.join(", ");
      } else {
        document.getElementById("responseMessage").textContent =
          "Erro ao criar taks.";
      }
      document.getElementById("responseMessage").classList.remove("success");
      document.getElementById("responseMessage").classList.add("error");
    });
}

document.getElementById("submit").addEventListener("click", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const descricao = document.getElementById("descrição").value;

  const taksData = {
    ColumnId: recuperaColumn.id,
    Title: name,
    Description: descricao,
    CreatedBy: recuperaUser.id,
  };

  createTaks(taksData);
});

function telaPrincipal() {
  window.location.href = "taskBoard.html";
}
