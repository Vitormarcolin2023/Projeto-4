import { API_BASE_URL } from "../../config/apiConfig.js";
import { getFromLocalStorage } from "../utils/storage.js";


const recuperarUser = getFromLocalStorage("user");
const body = document.querySelector("body");
const toggle = document.getElementById("dark-mode-toggle");
const tituloLogo = document.getElementById("titulo");
const header = document.querySelector(".header-content");
const logoutBtn = document.getElementById("logout-bnt");
const dropdown = document.querySelector(".dropbtn");
const kanban = document.querySelector(".kanban");

toggle.addEventListener("click", () => {
  let temaAtual = modificaTema();
  console.log(temaAtual);
  salvarNovoTema(recuperarUser.id, temaAtual);
});

function modificaTema() {
  toggle.classList.toggle("dark");
  body.classList.toggle("dark");
  tituloLogo.classList.toggle("dark");
  header.classList.toggle("dark");
  logoutBtn.classList.toggle("dark");
  dropdown.classList.toggle("dark");
  kanban.classList.toggle("dark");

  if (
    toggle.classList.contains("dark") &&
    body.classList.contains("dark") &&
    tituloLogo.classList.contains("dark") &&
    header.classList.contains("dark") &&
    logoutBtn.classList.contains("dark") &&
    dropdown.classList.contains("dark") &&
    kanban.classList.contains("dark")
  ) {
    return 1;
  } else {
    return 2;
  }
}

async function recuperaTema() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/PersonConfigById?PersonId=${recuperarUser.id}`
    );
    if (!response.ok) {
      throw new Error(
        `Erro ao carregar informações: ${response.status} - ${response.statusText}`
      );
    }
    const result = await response.json();
    if (result.DefaultThemeId === 1) {
      modificaTema();
    }
  } catch (error) {
    console.error("Erro ao recuperar tema:", error);
  }
}

async function salvarNovoTema(id, novoTema) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    ThemeId: novoTema,
  });

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      `${API_BASE_URL}/ConfigPersonTheme?PersonId=${id}`,
      requestOptions
    );
    if (!response.ok) {
      throw new Error(`Erro: ${response.status} - ${response.statusText}`);
    }
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error("Erro ao salvar informações:", error);
  }
}

recuperaTema();
