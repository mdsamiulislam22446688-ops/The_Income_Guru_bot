let tg = window.Telegram.WebApp;
tg.expand();

// User info
let user = tg.initDataUnsafe?.user || { id: 0, username: "guest" };

// Balance & Referral
let balance = parseInt(localStorage.getItem("balance_" + user.id)) || 100;
let refLink = `https://t.me/theIncomeGuru_bot?start=${user.id}`;
document.getElementById("refLink").value = refLink;

// Daily bonus tracking
let bonusData = JSON.parse(localStorage.getItem("bonus_" + user.id)) || { count: 0, lastClaim: 0 };

// Update balance display
function updateBalance() {
  document.getElementById("balance").innerText = `৳ ${balance}`;
}
updateBalance();

// Start button → Join Channel message
function onStart() {
  alert("📢 Mini App ব্যবহার করার আগে চ্যানেল Join করুন অথবা নিচের লিংক ক্লিক করুন।");
}

// Claim daily bonus (৩ বার / ২৪ ঘন্টা)
function claimBonus() {
  let now = Date.now();
  if (now - bonusData.lastClaim > 24*60*60*1000) {
    bonusData.count = 0;
  }

  if (bonusData.count < 3) {
    balance += 10;
    bonusData.count += 1;
    bonusData.lastClaim = now;
    localStorage.setItem("bonus_" + user.id, JSON.stringify(bonusData));
    localStorage.setItem("balance_" + user.id, balance);
    updateBalance();
    alert(`🎉 বোনাস দাবি করা হয়েছে! আজকে ${bonusData.count}/3 বার`);
  } else {
    alert("😅 আজকের বোনাস শেষ। ২৪ ঘন্টা পরে আবার চেষ্টা করুন।");
  }
}

// Copy referral link & give 55৳ for first referral
function copyLink() {
  navigator.clipboard.writeText(refLink);
  let referrals = parseInt(localStorage.getItem("ref_count_" + user.id)) || 0;
  
  if (!localStorage.getItem("ref_" + user.id)) {
    balance += 55; // Referral bonus
    localStorage.setItem("balance_" + user.id, balance);
    localStorage.setItem("ref_" + user.id, true);

    referrals += 1;
    localStorage.setItem("ref_count_" + user.id, referrals);

    updateBalance();
    alert("🔗 রেফারেল লিঙ্ক কপি হয়েছে! ৫৫৳ যুক্ত হয়েছে।");
  } else {
    alert("🔗 রেফারেল লিঙ্ক কপি হয়েছে!");
  }
}

// Withdraw function (Bkash/Nagad, min 700৳, 25 referrals required)
function withdraw() {
  if (balance < 700) {
    alert("❌ Withdraw করার জন্য কমপক্ষে 700৳ balance থাকতে হবে।");
    return;
  }

  let referrals = parseInt(localStorage.getItem("ref_count_" + user.id)) || 0;
  if (referrals < 25) {
    alert(`❌ Withdraw করার জন্য 25 টির বেশি referral থাকতে হবে। আপনার referral: ${referrals}`);
    return;
  }

  let method = prompt("Withdraw Method লিখুন: Bkash বা Nagad").toLowerCase();
  if (method !== "bkash" && method !== "nagad") {
    alert("❌ Bkash বা Nagad নির্বাচন করুন।");
    return;
  }

  let number = prompt(`${method.charAt(0).toUpperCase() + method.slice(1)} নাম্বার লিখুন`);
  if (!number || number.length < 11) {
    alert("❌ সঠিক নাম্বার লিখুন।");
    return;
  }

  let amount = prompt("কত টাকা Withdraw করতে চান?");
  amount = parseInt(amount);
  if (isNaN(amount) || amount <= 0) {
    alert("❌ সঠিক সংখ্যা লিখুন।");
    return;
  }

  if (amount > balance) {
    alert("❌ আপনার ব্যালান্সের চেয়ে বেশি টাকা withdraw করতে পারবেন না।");
    return;
  }

  if (amount < 700) {
    alert("❌ Minimum 700৳ withdraw করা যাবে।");
    return;
  }

  balance -= amount;
  localStorage.setItem("balance_" + user.id, balance);
  updateBalance();

  tg.sendData(`withdraw_${amount}_${method}_${number}`);
  alert(`✅ আপনার ${amount}৳ ${method.charAt(0).toUpperCase() + method.slice(1)} নাম্বারে withdraw request পাঠানো হয়েছে!`);
}