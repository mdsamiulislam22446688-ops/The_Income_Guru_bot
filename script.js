const tg = window.Telegram.WebApp;
tg.expand();

const urlParams = new URLSearchParams(window.location.search);
const refId = urlParams.get('start');

document.getElementById("username").innerText = tg.initDataUnsafe.user.first_name;
document.getElementById("balance").innerText = "৪৪০ টাকা"; // Backend থেকে আসবে

console.log("রেফারেল ID:", refId);