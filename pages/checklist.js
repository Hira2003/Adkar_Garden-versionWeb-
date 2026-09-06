// ---------- Data: Daily checklist items, grouped ----------
const checklistGroups = [
  {
    label: "الصلوات",
    items: [
      { id: "fajr", label: "صلاة الفجر", icon: "🌅" },
      { id: "duha", label: "صلاة الضحى", icon: "🌞" },
      { id: "dhuhr", label: "صلاة الظهر", icon: "☀️" },
      { id: "asr", label: "صلاة العصر", icon: "🌤️" },
      { id: "maghrib", label: "صلاة المغرب", icon: "🌇" },
      { id: "isha", label: "صلاة العشاء", icon: "🌌" },
      { id: "witr", label: "صلاة الوتر", icon: "✨" }
    ]
  },
  {
    label: "الأذكار والقرآن",
    items: [
      { id: "adhkar_sabah", label: "أذكار الصباح", icon: "🌱" },
      { id: "adhkar_masaa", label: "أذكار المساء", icon: "🌿" },
      { id: "quran", label: "قراءة القرآن", icon: "📖" }
    ]
  },
  {
    label: "أعمال أخرى",
    items: [
      { id: "sadaka", label: "الصدقة", icon: "🤲" },
      { id: "rahim", label: "صلة الرحم", icon: "👨‍👩‍👧" }
    ]
  }
];

const STORAGE_KEY = 'muslim_daily_checklist';

// ---------- State ----------
let today = new Date().toISOString().split('T')[0];
let checkedState = {}; // { itemId: true/false }

// ---------- DOM ----------
const checklistContainer = document.getElementById('checklistContainer');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');

// ---------- Storage ----------
function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const now = new Date().toISOString().split('T')[0];

  let data = null;
  if (saved) {
    try {
      data = JSON.parse(saved);
    } catch (e) {
      data = null;
    }
  }

  if (!data || data.date !== now) {
    checkedState = {};
    today = now;
    saveState();
  } else {
    checkedState = data.checked || {};
    today = data.date;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, checked: checkedState }));
}

// ---------- Rendering ----------
function totalItemCount() {
  return checklistGroups.reduce((sum, g) => sum + g.items.length, 0);
}

function render() {
  checklistContainer.innerHTML = '';
  let doneCount = 0;
  const total = totalItemCount();

  checklistGroups.forEach(group => {
    const groupLabel = document.createElement('div');
    groupLabel.className = 'checklist-group-label';
    groupLabel.innerText = group.label;
    checklistContainer.appendChild(groupLabel);

    group.items.forEach(item => {
      const isChecked = !!checkedState[item.id];
      if (isChecked) doneCount++;

      const row = document.createElement('div');
      row.className = 'checklist-item' + (isChecked ? ' checked' : '');

      const icon = document.createElement('span');
      icon.className = 'checklist-item-icon';
      icon.innerText = item.icon;

      const label = document.createElement('span');
      label.className = 'checklist-item-label';
      label.innerText = item.label;

      const box = document.createElement('span');
      box.className = 'checklist-checkbox';
      box.innerText = '✓';

      row.appendChild(icon);
      row.appendChild(label);
      row.appendChild(box);

      row.addEventListener('click', () => {
        checkedState[item.id] = !checkedState[item.id];
        saveState();
        render();
      });

      checklistContainer.appendChild(row);
    });
  });

  progressText.innerText = `تم إنجاز ${doneCount} من ${total}`;
  progressFill.style.width = total > 0 ? (doneCount / total) * 100 + '%' : '0%';
}

// ---------- Init ----------
loadState();
render();
