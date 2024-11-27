import { API_BASE_URL } from "../../config/apiConfig.js";
import { getFromLocalStorage } from "../utils/storage.js";

const recuperarUser = getFromLocalStorage("user");

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
  const resposta = await fetch(`${API_BASE_URL}/Boards`);

  if (!resposta.ok) {
    throw new Error("Erro ao carregar boards");
  }
  
}
