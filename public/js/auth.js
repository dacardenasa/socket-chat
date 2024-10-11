const button = document.getElementById("google_sigout");
const loginForm = document.querySelector("form");

const url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080/api/auth"
  : "https://rest-server-nodejs.onrender.com/api/auth";

function handleCredentialResponse(googleUser) {
  const body = { id_token: googleUser.credential };
  fetch(`${url}/google`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  })
    .then((res) => res.json())
    .then(({ token, user }) => {
      localStorage.setItem("email", user.email);
      localStorage.setItem("token", token);
      window.location = "chat.html";
    })
    .catch((error) => console.log(error));
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const email = formData.get("email");
  const password = formData.get("password");
  const body = { email, password };
  fetch(`${url}/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  })
    .then((res) => res.json())
    .then((data) => {
      if (data?.error) {
        console.info();
        return;
      }
      if (data?.user) {
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("token", data.token);
        window.location = "chat.html";
      }
    })
    .catch((error) => console.log(error));
});

button.addEventListener("click", () => {
  if (localStorage.getItem("email")) {
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke(localStorage.getItem("email"), () => {
      localStorage.clear();
      location.reload();
    });
  }
});
