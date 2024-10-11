const ENTER_KEY_CODE = 13;
let user = null;
let socket = null;
const uidNode = document.querySelector("#uid");
const messageNode = document.querySelector("#message");
const usersNode = document.querySelector("#users");
const messagesNode = document.querySelector("#messages");
const logoutNode = document.querySelector("#logout");


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
  socket = io({
    extraHeaders: {
      "x-token": localStorage.getItem("token")
    }
  });

  socket.on("connect", () => {
    console.info("Socket connected");
  });

  socket.on("disconnect", () => {
    console.info("Socket disconnected");
  });

  socket.on("get-messages", drawMessages);

  socket.on("get-active-users", drawUsers);

  socket.on("get-private-message", (payload) => {
    console.info(`Private ${payload}`);
  });
}

function drawUsers(users = []) {
  let usersHtml = "";
  users.forEach(({ name, uid }) => {
    usersHtml += `
    <li>
      <p>
        <h5 class="text-success">${name}</h5>
        <span class="fs-6 text-muted">${uid}</span>
      </p>
    </li>
  `;
  });
  usersNode.innerHTML = usersHtml;
}

function drawMessages(messages = []) {
  let messagesHtml = "";
  messages.forEach(({ name, message }) => {
    messagesHtml += `
    <li>
      <p>
        <span class="text-primary">${name}</span>
        <span>${message}</span>
      </p>
    </li>
  `;
  });
  messagesNode.innerHTML = messagesHtml;
}

messageNode.addEventListener("keyup", ({ keyCode }) => {
  const message = messageNode.value;
  const uid = uidNode.value;
  if (keyCode !== ENTER_KEY_CODE) return;
  if (message.length === 0) return;

  socket.emit("send-message", { message, uid });
  messageNode.value = "";
});

logoutNode.addEventListener("click", () => {
  localStorage.clear();
  window.location = "index.html";
})

async function main() {
  await validateJWT();
  connectSocket();
}

main();

// const socket = io();
