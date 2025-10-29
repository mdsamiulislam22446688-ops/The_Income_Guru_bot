const tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe.user;
const userId = user.id;
const userName = user.first_name || "ইউজার";
const refLink = `https://t.me/IncomeGuruBot?start=ref_${userId}`;

// হোমপেজে ইউজারের নাম ও রেফারেল লিংক দেখাও
if (document.getElementById("username")) {
  document.getElementById("username").innerText = userName;
}
if (document.getElementById("refLink")) {
  document.getElementById("refLink").value = refLink;
}

// প্রোফাইল ছবি লোড (Backend API থেকে)
if (document.getElementById("userPhoto")) {
  fetch(`/api/user-photo?user_id=${userId}`)
    .then(res => res.json())
    .then(data => {
      if (data.photo_url) {
        document.getElementById("userPhoto").src = data.photo_url;
      }
    });
}

// রেফারেল কপি ফাংশন
function copyReferral() {
  const input = document.getElementById("refLink");
  input.select();
  document.execCommand("copy");
  alert("✅ রেফারেল লিংক কপি হয়েছে!");
}