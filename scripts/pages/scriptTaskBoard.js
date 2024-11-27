import { API_BASE_URL } from "../../config/apiConfig.js";
import { getFromLocalStorage } from "../utils/storage.js";

const recuperarUser = getFromLocalStorage("user");
const boardsList = document.getElementById("boardsList");

/*Apresentar o nome do Usuario */
function recuperarNomeUser() {
  let userName = document.getElementById("nomeUsuario");

  if (recuperarUser) {
    userName.innerText = `Olá, ${recuperarUser.nome.split(" ")[0]}`;
  } else {
    userName.innerText = "Olá";
  }
}

recuperarNomeUser();

/*DropDown*/


async function carregarBoars() {
  try {
    const resposta = await fetch(`${API_BASE_URL}/Boards`);

    if (!resposta.ok) {
      throw new Error("Erro ao carregar boards");
    }
    const boards = await resposta.json();
    boardsDropdowns(boards);
  } catch (erro) {
    console.log("Erro ao carregar boards:", erro);
  }
}

function boardsDropdowns(boards) {
  boards.forEach((board) => {
    const listarItem = document.createElement("li");
    listarItem.innerHTML = `
    <a class="dropdown-item" id="dropdpwn-item" value="${board.id}">
      ${board.name}
    </a>`;

    listarItem.addEventListener("click", (event) => {
       loadBoards(board.id);
       document.querySelector('.dropbtn').textContent = board.name;
       myFunction(); // Fecha o dropdown após a seleção.
    });

    boardsList.appendChild(listarItem);
  });
}


