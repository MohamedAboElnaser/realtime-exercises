const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");

// let's store all current messages here
let allChat = [];

// the interval to poll at in milliseconds
const INTERVAL = 3000;

// a submit listener on the form in the HTML
chat.addEventListener("submit", function (e) {
  e.preventDefault();
  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  chat.elements.text.value = "";
});

async function postNewMsg(user, text) {
  // post to /poll a new message
  // write code here
  const data = {
    user,
    text,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  try {
    const res = await fetch("/poll", options);
    if (res.ok) {
      const newMsg = await res.json();
      allChat.push(newMsg); // add the new message to the local chat array
      render(); // re-render the messages
    } else {
      console.error("Failed to post message:", res.statusText);
    }
  } catch (error) {
    console.error("Error posting message:", error);
  }
}

async function getNewMsgs() {
  // poll the server
  // write code here
  try {
    const res = await fetch("/poll");
    const data = await res.json();
    allChat = data;
    render();
    setTimeout(getNewMsgs, INTERVAL); // set up the next poll
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
}

function render() {
  // as long as allChat is holding all current messages, this will render them
  // into the ui. yes, it's inefficent. yes, it's fine for this example
  const html = allChat.map(({ user, text, time, id }) =>
    template(user, text, time, id)
  );
  msgs.innerHTML = html.join("\n");
}

// given a user and a msg, it returns an HTML string to render to the UI
const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;

// make the first request
getNewMsgs();
