import { API_BASE_URL } from "../../config/apiConfig.js";
import { getFromLocalStorage } from "../utils/storage.js";

const recuperaUser = getFromLocalStorage("user");
const recuperarBoard = getFromLocalStorage("board");

function ediarBoard(boardDataEditar) {
  const endpoint = `${API_BASE_URL}/Board?BoardId=${recuperarBoard}`;

  fetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(boardDataEditar),
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
      console.log("Board Editado com sucesso:", data);
      document.getElementById("responseMessage").textContent =
        "Board Editado com sucesso!";
      document.getElementById("responseMessage").classList.remove("error");
      document.getElementById("responseMessage").classList.add("success");
    })
    .catch((errorData) => {
      console.error("Erro ao editar Board:", errorData);
      // Exibir a mensagem de erro
      if (errorData.Errors && errorData.Errors.length > 0) {
        document.getElementById("responseMessage").textContent =
          errorData.Errors.join(", ");
      } else {
        document.getElementById("responseMessage").textContent =
          "Erro ao editar Board.";
      }
      document.getElementById("responseMessage").classList.remove("success");
      document.getElementById("responseMessage").classList.add("error");
    });
}

document.getElementById("submit").addEventListener("click", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const descricao = document.getElementById("descrição").value;

  const boardDataEditar = {
    Name: name,
    Description: descricao,
    UpdatedBy: recuperaUser.id,
  };

  ediarBoard(boardDataEditar);
});
