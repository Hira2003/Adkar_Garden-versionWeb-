// State Management
let adkarList = [
  "سبحان الله وبحمده",
  "الحمد لله",
  "لا إله إلا الله",
  "الله أكبر",
  "أستغفر الله وأتوب إليه"
];

let adkarCountDay = 0;
let adkarCountLifetime = 0;
let countDate = new Date().toISOString().split('T')[0];
let lastNotificationHour = null;

// DOM Elements
const counterLabel = document.getElementById('counterLabel');
const timeLabel = document.getElementById('timeLabel');
const adkarListContainer = document.getElementById('adkarListContainer');
const specialDikrBtn = document.getElementById('specialDikrBtn');

// Modal Elements
const addModal = document.getElementById('addModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const saveDikrBtn = document.getElementById('saveDikrBtn');
const dikrInput = document.getElementById('dikrInput');

// Toast Notification Elements
const toastOverlay = document.getElementById('toastOverlay');
const toastMessage = document.getElementById('toastMessage');
const closeToastBtn = document.getElementById('closeToastBtn');

// 1. Validation Logic
function isValidDikr(text) {
  const trimmed = text.trim();
  if (!trimmed) return false;
  // Arabic character validation
  const arabicRegex = /^[\u0600-\u06FF\s،؛\-]+$/;
  if (!arabicRegex.test(trimmed)) return false;
  // Word limit (max 20 words)
  if (trimmed.split(/\s+/).length > 20) return false;
  return true;
}

// 2. Storage & Count Functions
function loadCounts() {
  const saved = localStorage.getItem('adkar_count');
  const today = new Date().toISOString().split('T')[0];

  if (saved) {
    try {
      const data = JSON.parse(saved);
      adkarCountLifetime = data.lifetime_count || 0;
      countDate = data.date || today;

      if (countDate !== today) {
        adkarCountDay = 0;
        countDate = today;
      } else {
        adkarCountDay = data.day_count || 0;
      }
    } catch (e) {
      resetCounts(today);
    }
  } else {
    resetCounts(today);
  }
  updateCounterLabel();
}

function resetCounts(today) {
  adkarCountDay = 0;
  adkarCountLifetime = 0;
  countDate = today;
}

function saveCounts() {
  const data = {
    day_count: adkarCountDay,
    lifetime_count: adkarCountLifetime,
    date: countDate
  };
  localStorage.setItem('adkar_count', JSON.stringify(data));
}

function incrementCounter() {
  checkNewDay();
  adkarCountDay++;
  adkarCountLifetime++;
  saveCounts();
  updateCounterLabel();
}

function updateCounterLabel() {
  counterLabel.innerText = `عدد الأذكار اليوم: ${adkarCountDay} | المجموع: ${adkarCountLifetime}`;
}

function checkNewDay() {
  const today = new Date().toISOString().split('T')[0];
  if (today !== countDate) {
    countDate = today;
    adkarCountDay = 0;
    saveCounts();
    updateCounterLabel();
  }
}

// 3. Adkar List & File Loading (JSON/LocalStorage)
async function loadAdkar() {
  const savedAdkar = localStorage.getItem('adkar_list');
  if (savedAdkar) {
    try {
      adkarList = JSON.parse(savedAdkar);
    } catch (e) {
      console.error("Failed to parse saved adkar");
    }
  } else {
    // Attempt to fetch adkar.json locally if present
    try {
      const res = await fetch('adkar.json');
      if (res.ok) {
        const data = await res.json();
        if (data.adkar && Array.isArray(data.adkar)) {
          adkarList = data.adkar;
          saveAdkarList();
        }
      }
    } catch (e) {
      console.log("Using default adkar list.");
    }
  }
  renderAdkarButtons();
}

function saveAdkarList() {
  localStorage.setItem('adkar_list', JSON.stringify(adkarList));
}

function renderAdkarButtons() {
  adkarListContainer.innerHTML = '';
  adkarList.forEach(dikr => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-dikr';
    btn.innerText = dikr;
    btn.addEventListener('click', incrementCounter);
    adkarListContainer.appendChild(btn);
  });
}

function addNewDikr(text) {
  adkarList.push(text);
  saveAdkarList();
  renderAdkarButtons();
}

// 4. Timer & Hourly Notification
function updateTime() {
  const now = new Date();
  timeLabel.innerText = now.toLocaleString('ar-EG');

  checkNewDay();
  checkHourlyNotification(now);
}

function checkHourlyNotification(now) {
  if (now.getMinutes() === 0 && now.getSeconds() === 0) {
    if (lastNotificationHour !== now.getHours()) {
      showHourlyDikr();
      lastNotificationHour = now.getHours();
    }
  } else if (lastNotificationHour !== now.getHours()) {
    lastNotificationHour = null;
  }
}

function showHourlyDikr() {
  if (adkarList.length > 0) {
    const randomDikr = adkarList[Math.floor(Math.random() * adkarList.length)];
    toastMessage.innerText = randomDikr;
    toastOverlay.classList.add('active');
  }
}

// Event Listeners
specialDikrBtn.addEventListener('click', incrementCounter);
openModalBtn.addEventListener('click', () => addModal.classList.add('active'));
closeModalBtn.addEventListener('click', () => addModal.classList.remove('active'));
closeToastBtn.addEventListener('click', () => toastOverlay.classList.remove('active'));

saveDikrBtn.addEventListener('click', () => {
  const value = dikrInput.value;
  if (!isValidDikr(value)) {
    alert("الرجاء إدخال ذكر صحيح فقط (بدون جمل أو أحاديث، 20 كلمة كحد أقصى)");
    return;
  }
  addNewDikr(value);
  dikrInput.value = '';
  addModal.classList.remove('active');
});

// Initialization
loadCounts();
loadAdkar();
setInterval(updateTime, 1000);
setTimeout(showHourlyDikr, 500);
