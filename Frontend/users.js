const BASE_URL = "http://localhost:5000/api/users";
const usuariosList = document.getElementById("usuariosList");
const logoutBtn = document.getElementById("logoutBtn");

// Verificar si hay token
const token = localStorage.getItem("token");
if (!token) {
  alert("Debes iniciar sesión para acceder a esta página");
  window.location.href = "login.html"; // redirigir al login
}

// Cerrar sesión
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

// Obtener usuarios
async function fetchUsuarios() {
  try {
    const res = await fetch(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();

    if (data.success) {
      usuariosList.innerHTML = "";
      data.usuarios.forEach(u => {
        const div = document.createElement("div");
        div.className = "usuario";
        div.textContent = `${u.nombre} (${u.email})`;
        usuariosList.appendChild(div);
      });
    } else {
      usuariosList.innerHTML = `<p style="color:red;">${data.message}</p>`;
    }
  } catch (err) {
    usuariosList.innerHTML = "<p style='color:red;'>Error al obtener usuarios</p>";
  }
}

fetchUsuarios();
