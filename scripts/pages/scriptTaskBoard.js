function logoff() {
  localStorage.clear();
  window.location.href = "index.html";
}

const columns = document.querySelectorAll(".column");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const body = document.body;

let darkMode = localStorage.getItem("darkMode");

if (darkMode === "enabled") {
  enableDarkMode();
}

darkModeToggle.addEventListener("change", () => {
  darkMode = localStorage.getItem("darkMode");

  if (darkMode !== "enabled") {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});

function enableDarkMode() {
  body.classList.add("dark-mode");
  localStorage.setItem("darkMode", "enabled");
  darkModeToggle.checked = true;
}

function disableDarkMode() {
  body.classList.remove("dark-mode");
  localStorage.setItem("darkMode", "disabled");
  darkModeToggle.checked = false;
}

document.addEventListener("dragstart", (e) => {
  if (e.target.classList.contains("item")) {
    e.target.classList.add("dragging");
  }
});

document.addEventListener("dragend", (e) => {
  if (e.target.classList.contains("item")) {
    e.target.classList.remove("dragging");
  }
});

columns.forEach((column) => {
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
    const dragging = document.querySelector(".dragging");
    const itemsContainer = column.querySelector(".items-container");
    const applyAfter = getNewPosition(itemsContainer, e.clientY);

    if (dragging && itemsContainer) {
      // Verifica se ambos os elementos existem
      if (applyAfter) {
        itemsContainer.insertBefore(dragging, applyAfter.nextElementSibling);
      } else {
        itemsContainer.prepend(dragging);
      }
    }
  });
});

function getNewPosition(itemsContainer, posY) {
  const cards = itemsContainer.querySelectorAll(".item:not(.dragging)");
  let result = null; // Inicializa como null

  for (let refer_card of cards) {
    const box = refer_card.getBoundingClientRect();
    const boxCenterY = box.y + box.height / 2;

    if (posY >= boxCenterY) {
      result = refer_card;
    }
  }
  return result;
}

/* Quando o usuário clicar no botão, alterne entre ocultar e mostrar o conteúdo suspenso/dropdown. */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Feche o menu suspenso/dropdown se o usuário clicar fora dele.
window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};
