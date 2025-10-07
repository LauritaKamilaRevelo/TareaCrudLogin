const BASE_URL = "http://localhost:5000/api/users";

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const messageDiv = document.getElementById("message");

// --- LOGIN ---
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
            const res = await fetch(`${BASE_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.success) {
                // Guardar token en localStorage
                localStorage.setItem("token", data.token);
                
                // Mensaje de éxito
                messageDiv.textContent = "Login exitoso. Redirigiendo...";
                messageDiv.style.color = "green";

                // Redirigir a users.html después de 1s
                setTimeout(() => {
                    window.location.href = "users.html";
                }, 1000);
            } else {
                messageDiv.textContent = data.message || "Credenciales incorrectas";
                messageDiv.style.color = "red";
            }
        } catch (error) {
            messageDiv.textContent = "Error al conectar con el servidor";
            messageDiv.style.color = "red";
        }
    });
}

// --- REGISTRO ---
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
            const res = await fetch(`${BASE_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, email, password })
            });
            const data = await res.json();

            if (data.success) {
                messageDiv.textContent = "Usuario registrado correctamente. Ahora puedes iniciar sesión.";
                messageDiv.style.color = "green";
                registerForm.reset();
            } else {
                messageDiv.textContent = data.message || "Error al registrar usuario";
                messageDiv.style.color = "red";
            }
        } catch (error) {
            messageDiv.textContent = "Error al conectar con el servidor";
            messageDiv.style.color = "red";
        }
    });
}
