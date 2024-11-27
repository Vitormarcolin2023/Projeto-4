function funcLogoff() {
  localStorage.clear();
  window.location.href = "index.html";
}

/*Codigo de como função basica do Drop */
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
