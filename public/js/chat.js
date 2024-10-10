let user = null;
let socket = null;
const url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080/api/auth"
  : "https://rest-server-nodejs.onrender.com/api/auth";

async function validateJWT() {
  const token = localStorage.getItem("token") ?? "";
  if (token.length < 10) {
    window.location = "index.html";
    throw new Error("Invalid token");
  }
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "x-token": token
    }
  });
  const { user: userDB, token: tokenDB } = await response.json();
  localStorage.setItem("token", tokenDB);
  user = userDB;
  document.title = user.name;
}

function connectSocket() {
  const socket = io({
    extraHeaders: {
      "x-token": localStorage.getItem("token")
    }
  });
}

async function main() {
  await validateJWT();
  connectSocket();
}

main();

// const socket = io();
