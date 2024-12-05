import { API_BASE_URL } from "../../config/apiConfig.js";
import { getFromLocalStorage } from "../utils/storage.js";

const recuperarBoard = getFromLocalStorage("board");


function createColumn(columnData) {
  const endpoint = `${API_BASE_URL}/Column`;

  fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(columnData),
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

  const columnData = {
    BoardId: recuperarBoard.id,
    Name: name,
  };

  createColumn(columnData);
});
