import { API_BASE_URL } from "../../config/apiConfig.js";
import { getFromLocalStorage } from "../utils/storage.js";

const recuperaUser = getFromLocalStorage("user");
const recuperaColumn = getFromLocalStorage("coluna");

function createColumn(boardData) {
  const endpoint = `${API_BASE_URL}/Board`;

  fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(boardData),
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
      console.log("Coluna criada com sucesso:", data);
      document.getElementById("responseMessage").textContent =
        "Coluna criada com sucesso!";
      document.getElementById("responseMessage").classList.remove("error");
      document.getElementById("responseMessage").classList.add("success");
    })
    .catch((errorData) => {
      console.error("Erro ao criar coluna:", errorData);
      // Exibir a mensagem de erro
      if (errorData.Errors && errorData.Errors.length > 0) {
        document.getElementById("responseMessage").textContent =
          errorData.Errors.join(", ");
      } else {
        document.getElementById("responseMessage").textContent =
          "Erro ao criar coluna.";
      }
      document.getElementById("responseMessage").classList.remove("success");
      document.getElementById("responseMessage").classList.add("error");
    });
}

document.getElementById("submit").addEventListener("click", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const descricao = document.getElementById("descrição").value;

  const boardData = {
    Name: name,
    Description: descricao,
    CreatedBy: recuperaUser.id,
  };

  createColumn(boardData);
});

function telaPrincipal() {
  window.location.href = "taskBoard.html";
}
