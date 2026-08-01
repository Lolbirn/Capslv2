if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

const STORAGE_KEY = "capsl-supplements-v1";
const CHECKS_KEY = "capsl-checks-v1";
const LANG_KEY = "capsl-lang-v1";
const THEME_KEY = "capsl-theme-v1";
const REMINDERS_KEY = "capsl-reminders-v1";
const REMINDER_ID_BASE = 1000;
const REMINDER_TIME_PRESETS = ["08:00", "13:00", "20:00"];
const OLD_STORAGE_KEYS = ["supproutine-supplements-v2", "supproutine-supplements-v1", "coredose-supplements-v1"];
const OLD_CHECK_KEYS = ["supproutine-checks-v2", "supproutine-checks-v1", "coredose-checks-v1"];

const storedTheme = localStorage.getItem(THEME_KEY);
let currentTheme = storedTheme === "dark" || storedTheme === "light"
  ? storedTheme
  : window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

if (currentTheme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
}

const storedLang = localStorage.getItem(LANG_KEY);
let currentLang = storedLang === "en" || storedLang === "de"
  ? storedLang
  : (navigator.language || "").toLowerCase().startsWith("de")
    ? "de"
    : "en";

const TRANSLATIONS = {
  de: {
    appMenuLabel: "App-Menü",
    exportData: "Daten exportieren",
    importData: "Daten importieren",
    resetDay: "Tag zurücksetzen",
    tagline: "Daily Supplement System",
    leadHtml: "<strong>Dein Stack.</strong> Jeden Tag im Griff.",
    addSupplement: "+ Supplement",
    today: "Heute",
    todayEyebrow: "Heute",
    routineTitle: "Tagesroutine",
    dailySummaryLabel: "Tagesübersicht",
    doneToday: "Heute erledigt",
    supplementsLabel: "Supplements",
    openLabel: "offen",
    streakLabel: "Tage Streak",
    historyLabel: "14-Wochen-Verlauf",
    historyRangeLabel: "14 Wochen",
    showHistory: "Historie anzeigen",
    heatmapLess: "Weniger",
    heatmapMore: "Mehr",
    checkAllGroup: "Alle abhaken",
    switchToDark: "Dunkelmodus aktivieren",
    switchToLight: "Hellmodus aktivieren",
    reminders: "Erinnerungen",
    remindersEyebrow: "Erinnerungen",
    remindersTitle: "Erinnerungen",
    remindersHint: "Bekomme eine Benachrichtigung, auch wenn Capsl geschlossen ist.",
    remindersPermissionDenied: "Benachrichtigungen sind deaktiviert. Bitte erlaube sie in den Geräteeinstellungen.",
    addReminder: "+ Erinnerung hinzufügen",
    deleteReminder: "Erinnerung löschen",
    reminderMorning: "Guten Morgen! Zeit für deinen Supplement-Stack 💊",
    reminderMidday: "Nicht vergessen: dein Mittags-Supplement wartet 💊",
    reminderEvening: "Zeit für deine Abend-Routine 💊",
    stockEyebrow: "Vorrat",
    stockTitle: "Vorrat",
    critical: "kritisch",
    paused: "pausiert",
    newEntryEyebrow: "Neuer Eintrag",
    addSupplementTitle: "Supplement hinzufügen",
    editSupplementTitle: "Supplement bearbeiten",
    close: "Schließen",
    step1Heading: "Supplement wählen",
    step1Hint: "Starte mit einem Preset oder lege ein eigenes Supplement an.",
    quickSelectLabel: "Schnellauswahl",
    customMode: "Eigenes Supplement eintragen",
    nameLabel: "Name",
    namePlaceholder: "Vitamin D3, Kreatin, Magnesium...",
    step2Heading: "Dosis & Vorrat feinjustieren",
    doseLabel: "Dosis",
    unitLabel: "Einheit",
    timeLabel: "Zeitpunkt",
    timeHint: "Mehrfachauswahl möglich, z. B. Mittags & Abends bei geteilten Dosen.",
    stockLabel: "Vorrat",
    stockUnitLabel: "Vorrats-Einheit",
    servingLabel: "Verbrauch pro Einnahme",
    save: "Speichern",
    saveChanges: "Änderungen speichern",
    refillStockTitle: "Vorrat auffüllen",
    fillFull: "Voll auffüllen",
    customAmountLabel: "Eigene Menge hinzufügen",
    customAmountPlaceholder: "z. B. 90",
    addAmount: "Menge hinzufügen",
    backupEyebrow: "Backup",
    backupTitle: "Daten sichern",
    backupDataLabel: "Backup-Daten",
    backupHintExport: "Kopiere dein Backup oder lade es als Datei herunter.",
    backupHintImport: "Füge ein Capsl-Backup ein oder wähle eine JSON-Datei.",
    backupTextPlaceholder: "Backup-Text hier einfügen...",
    downloadBackup: "Backup herunterladen",
    copyText: "Text kopieren",
    chooseFile: "Datei wählen",
    importText: "Text importieren",
    undo: "Rückgängig",
    emptyNoSupplementsTitle: "Noch nichts eingetragen",
    emptyNoSupplementsBody: "Leg dein erstes Supplement an und starte deine Routine.",
    emptyAddButton: "+ Supplement hinzufügen",
    emptyAllPausedTitle: "Alle Supplements pausiert",
    emptyAllPausedBody: "Aktiviere eins im Vorrat, um es wieder in deiner Routine zu sehen.",
    emptyStock: "Vorrat erscheint hier, sobald du dein erstes Supplement anlegst.",
    completionTitle: "Heute abgeschlossen",
    completionBody: "Dein Stack ist erledigt.",
    daysLeft: (days) => `reicht noch ${days} Tage`,
    markAsTaken: (name) => `${name} als eingenommen markieren`,
    done: "Erledigt",
    taken: "Eingenommen",
    itemActions: (name) => `${name} Aktionen`,
    edit: "Bearbeiten",
    pause: "Pausieren",
    activate: "Aktivieren",
    deleteAction: "Löschen",
    almostEmpty: (count) => `${count} bald leer`,
    stockRemaining: (stock, serving) => `${stock} übrig · ${serving} pro Einnahme`,
    statusPaused: "Pausiert",
    statusLow: "Knapp",
    statusStable: "Stabil",
    daysUnit: (days) => `${days} Tage`,
    refill: "Auffüllen",
    refillDescription: (name, stock) => `${name}: aktuell ${stock} übrig.`,
    deletedToast: (name) => `„${name}“ gelöscht`,
    backupFilePrepared: "Backup-Datei wurde vorbereitet.",
    backupDownloadFailed: "Download fehlgeschlagen. Bitte prüfe den Backup-Text.",
    backupCopied: "Backup-Text wurde kopiert.",
    backupCopiedFallback: "Backup-Text wurde zum Kopieren markiert.",
    backupImported: "Backup wurde importiert.",
    backupImportFailed: "Import fehlgeschlagen. Bitte prüfe den Backup-Text.",
    fileImportFailed: "Import fehlgeschlagen. Bitte wähle eine gültige Capsl-Backup-Datei.",
    languageToggle: "🇬🇧 English",
    legalLink: "Impressum & Datenschutz",
  },
  en: {
    appMenuLabel: "App menu",
    exportData: "Export data",
    importData: "Import data",
    resetDay: "Reset day",
    tagline: "Daily Supplement System",
    leadHtml: "<strong>Your stack.</strong> Handled every day.",
    addSupplement: "+ Supplement",
    today: "Today",
    todayEyebrow: "Today",
    routineTitle: "Daily routine",
    dailySummaryLabel: "Daily overview",
    doneToday: "Done today",
    supplementsLabel: "Supplements",
    openLabel: "open",
    streakLabel: "day streak",
    historyLabel: "14-week history",
    historyRangeLabel: "14 weeks",
    showHistory: "Show history",
    heatmapLess: "Less",
    heatmapMore: "More",
    checkAllGroup: "Check all",
    switchToDark: "Switch to dark mode",
    switchToLight: "Switch to light mode",
    reminders: "Reminders",
    remindersEyebrow: "Reminders",
    remindersTitle: "Reminders",
    remindersHint: "Get notified even when Capsl is closed.",
    remindersPermissionDenied: "Notifications are disabled. Please allow them in your device settings.",
    addReminder: "+ Add reminder",
    deleteReminder: "Delete reminder",
    reminderMorning: "Good morning! Time for your supplement stack 💊",
    reminderMidday: "Don't forget: your midday supplement is waiting 💊",
    reminderEvening: "Time for your evening routine 💊",
    stockEyebrow: "Stock",
    stockTitle: "Stock",
    critical: "critical",
    paused: "paused",
    newEntryEyebrow: "New entry",
    addSupplementTitle: "Add supplement",
    editSupplementTitle: "Edit supplement",
    close: "Close",
    step1Heading: "Choose a supplement",
    step1Hint: "Start with a preset or add your own supplement.",
    quickSelectLabel: "Quick select",
    customMode: "Add your own supplement",
    nameLabel: "Name",
    namePlaceholder: "Vitamin D3, creatine, magnesium...",
    step2Heading: "Fine-tune dose & stock",
    doseLabel: "Dose",
    unitLabel: "Unit",
    timeLabel: "Time",
    timeHint: "Multiple selections possible, e.g. noon & evening for split doses.",
    stockLabel: "Stock",
    stockUnitLabel: "Stock unit",
    servingLabel: "Amount per dose",
    save: "Save",
    saveChanges: "Save changes",
    refillStockTitle: "Refill stock",
    fillFull: "Fill completely",
    customAmountLabel: "Add a custom amount",
    customAmountPlaceholder: "e.g. 90",
    addAmount: "Add amount",
    backupEyebrow: "Backup",
    backupTitle: "Back up data",
    backupDataLabel: "Backup data",
    backupHintExport: "Copy your backup or download it as a file.",
    backupHintImport: "Paste a Capsl backup or choose a JSON file.",
    backupTextPlaceholder: "Paste backup text here...",
    downloadBackup: "Download backup",
    copyText: "Copy text",
    chooseFile: "Choose file",
    importText: "Import text",
    undo: "Undo",
    emptyNoSupplementsTitle: "Nothing added yet",
    emptyNoSupplementsBody: "Add your first supplement and start your routine.",
    emptyAddButton: "+ Add supplement",
    emptyAllPausedTitle: "All supplements paused",
    emptyAllPausedBody: "Activate one in Stock to see it in your routine again.",
    emptyStock: "Your stock will appear here once you add your first supplement.",
    completionTitle: "Done for today",
    completionBody: "Your stack is complete.",
    daysLeft: (days) => `${days} days left`,
    markAsTaken: (name) => `Mark ${name} as taken`,
    done: "Done",
    taken: "Taken",
    itemActions: (name) => `${name} actions`,
    edit: "Edit",
    pause: "Pause",
    activate: "Activate",
    deleteAction: "Delete",
    almostEmpty: (count) => `${count} running low`,
    stockRemaining: (stock, serving) => `${stock} left · ${serving} per dose`,
    statusPaused: "Paused",
    statusLow: "Low",
    statusStable: "Stable",
    daysUnit: (days) => `${days} days`,
    refill: "Refill",
    refillDescription: (name, stock) => `${name}: currently ${stock} left.`,
    deletedToast: (name) => `"${name}" deleted`,
    backupFilePrepared: "Backup file is ready.",
    backupDownloadFailed: "Download failed. Please check the backup text.",
    backupCopied: "Backup text copied.",
    backupCopiedFallback: "Backup text selected for copying.",
    backupImported: "Backup imported.",
    backupImportFailed: "Import failed. Please check the backup text.",
    fileImportFailed: "Import failed. Please choose a valid Capsl backup file.",
    languageToggle: "🇩🇪 Deutsch",
    legalLink: "Legal notice & Privacy",
  },
};

const TIME_LABELS = {
  de: {
    Morgens: "Morgens",
    Mittags: "Mittags",
    Abends: "Abends",
    "Vor dem Training": "Vor dem Training",
    "Nach dem Training": "Nach dem Training",
  },
  en: {
    Morgens: "Morning",
    Mittags: "Midday",
    Abends: "Evening",
    "Vor dem Training": "Pre-workout",
    "Nach dem Training": "Post-workout",
  },
};

const UNIT_LABELS = {
  de: {
    Kapsel: { singular: "Kapsel", plural: "Kapseln" },
    Tablette: { singular: "Tablette", plural: "Tabletten" },
    g: { singular: "g", plural: "g" },
    mg: { singular: "mg", plural: "mg" },
    Scoop: { singular: "Scoop", plural: "Scoops" },
    Tropfen: { singular: "Tropfen", plural: "Tropfen" },
    Portion: { singular: "Portion", plural: "Portionen" },
  },
  en: {
    Kapsel: { singular: "capsule", plural: "capsules" },
    Tablette: { singular: "tablet", plural: "tablets" },
    g: { singular: "g", plural: "g" },
    mg: { singular: "mg", plural: "mg" },
    Scoop: { singular: "scoop", plural: "scoops" },
    Tropfen: { singular: "drop", plural: "drops" },
    Portion: { singular: "serving", plural: "servings" },
  },
};

const STOCK_UNIT_TO_DOSE_UNIT = {
  Kapseln: "Kapsel",
  Kapsel: "Kapsel",
  Tabletten: "Tablette",
  Tablette: "Tablette",
  Scoops: "Scoop",
  Scoop: "Scoop",
  Portionen: "Portion",
  Portion: "Portion",
  Tropfen: "Tropfen",
  g: "g",
  mg: "mg",
};

function t(key, ...args) {
  const entry = (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) ?? TRANSLATIONS.de[key];
  return typeof entry === "function" ? entry(...args) : entry;
}

function timeLabel(time) {
  return (TIME_LABELS[currentLang] && TIME_LABELS[currentLang][time]) || time;
}

function dateLocale() {
  return currentLang === "en" ? "en-US" : "de-DE";
}

function setLanguage(lang) {
  currentLang = lang === "en" ? "en" : "de";
  localStorage.setItem(LANG_KEY, currentLang);
  applyStaticTranslations();
  applyTheme();
  renderTemplateCards();
  render();
}

function applyStaticTranslations() {
  document.documentElement.lang = currentLang;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    element.innerHTML = t(element.dataset.i18nHtml);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });

  document.querySelectorAll(".time-toggle[data-time]").forEach((button) => {
    button.textContent = timeLabel(button.dataset.time);
  });

  document.querySelectorAll("[data-unit][data-unit-form]").forEach((option) => {
    const entry = (UNIT_LABELS[currentLang] && UNIT_LABELS[currentLang][option.dataset.unit]) || {};
    option.textContent = entry[option.dataset.unitForm] || option.dataset.unit;
  });

  if (elements.languageToggleButton) {
    const [flag, ...labelParts] = t("languageToggle").split(" ");
    elements.languageToggleButton.innerHTML = `${flag} <span class="lang-label">${escapeHTML(labelParts.join(" "))}</span>`;
  }
}

const MOON_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/></svg>';
const SUN_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

function applyTheme() {
  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }

  if (elements.themeToggleButton) {
    elements.themeToggleButton.innerHTML = currentTheme === "dark" ? SUN_ICON : MOON_ICON;
    elements.themeToggleButton.setAttribute("aria-label", t(currentTheme === "dark" ? "switchToLight" : "switchToDark"));
  }

  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", currentTheme === "dark" ? "#14100c" : "#211a16");
  }
}

function setTheme(theme) {
  currentTheme = theme === "dark" ? "dark" : "light";
  localStorage.setItem(THEME_KEY, currentTheme);
  applyTheme();
}

const todayKey = toDateKey(new Date());

const supplementTemplates = [
  { name: "Vitamin D3 + K2", doseAmount: 1, doseUnit: "Kapsel", time: "Morgens", stock: 60, stockUnit: "Kapseln", serving: 1 },
  { name: "Magnesium Glycinate", doseAmount: 2, doseUnit: "Kapsel", time: "Abends", stock: 90, stockUnit: "Kapseln", serving: 2 },
  { name: "Omega 3", doseAmount: 2, doseUnit: "Kapsel", time: "Mittags", stock: 120, stockUnit: "Kapseln", serving: 2 },
  { name: "Creatine Monohydrate", doseAmount: 5, doseUnit: "g", time: "Nach dem Training", stock: 300, stockUnit: "g", serving: 5 },
  { name: "Zink", doseAmount: 1, doseUnit: "Tablette", time: "Abends", stock: 60, stockUnit: "Tabletten", serving: 1 },
  { name: "Ashwagandha", doseAmount: 1, doseUnit: "Kapsel", time: "Abends", stock: 60, stockUnit: "Kapseln", serving: 1 },
  { name: "Electrolytes", doseAmount: 1, doseUnit: "Scoop", time: "Vor dem Training", stock: 30, stockUnit: "Scoops", serving: 1 },
  { name: "Protein", doseAmount: 1, doseUnit: "Scoop", time: "Nach dem Training", stock: 30, stockUnit: "Scoops", serving: 1 },
];

const defaultSupplements = [
  createSupplement(supplementTemplates[0]),
  createSupplement(supplementTemplates[3]),
  createSupplement(supplementTemplates[1]),
];

const state = {
  supplements: normalizeSupplements(loadJSON(STORAGE_KEY, loadFirst(OLD_STORAGE_KEYS, defaultSupplements))),
  checks: {},
};
state.checks = migrateChecks(loadJSON(CHECKS_KEY, loadFirst(OLD_CHECK_KEYS, {})), state.supplements);

let pendingDelete = null;
let pendingDeleteTimer = null;

const elements = {
  openFormButton: document.querySelector("#openFormButton"),
  closeFormButton: document.querySelector("#closeFormButton"),
  resetDayButton: document.querySelector("#resetDayButton"),
  exportDataButton: document.querySelector("#exportDataButton"),
  importDataButton: document.querySelector("#importDataButton"),
  importFileInput: document.querySelector("#importFileInput"),
  appMenu: document.querySelector(".app-menu"),
  showTodayButton: document.querySelector("#showTodayButton"),
  formPanel: document.querySelector("#formPanel"),
  supplementForm: document.querySelector("#supplementForm"),
  formTitle: document.querySelector("#formTitle"),
  saveSupplementButton: document.querySelector("#saveSupplementButton"),
  editIdInput: document.querySelector("#editIdInput"),
  templateCards: document.querySelector("#templateCards"),
  customModeButton: document.querySelector("#customModeButton"),
  templateInput: document.querySelector("#templateInput"),
  templateOptions: document.querySelector("#templateOptions"),
  doseAmountInput: document.querySelector("#doseAmountInput"),
  doseUnitInput: document.querySelector("#doseUnitInput"),
  timeToggleGroup: document.querySelector("#timeToggleGroup"),
  stockInput: document.querySelector("#stockInput"),
  stockUnitInput: document.querySelector("#stockUnitInput"),
  servingInput: document.querySelector("#servingInput"),
  refillPanel: document.querySelector("#refillPanel"),
  closeRefillButton: document.querySelector("#closeRefillButton"),
  refillForm: document.querySelector("#refillForm"),
  refillIdInput: document.querySelector("#refillIdInput"),
  refillDescription: document.querySelector("#refillDescription"),
  refillAmountInput: document.querySelector("#refillAmountInput"),
  backupPanel: document.querySelector("#backupPanel"),
  closeBackupButton: document.querySelector("#closeBackupButton"),
  backupTextArea: document.querySelector("#backupTextArea"),
  backupHint: document.querySelector("#backupHint"),
  downloadBackupButton: document.querySelector("#downloadBackupButton"),
  copyBackupButton: document.querySelector("#copyBackupButton"),
  chooseImportFileButton: document.querySelector("#chooseImportFileButton"),
  importBackupTextButton: document.querySelector("#importBackupTextButton"),
  remindersButton: document.querySelector("#remindersButton"),
  remindersPanel: document.querySelector("#remindersPanel"),
  closeRemindersButton: document.querySelector("#closeRemindersButton"),
  remindersList: document.querySelector("#remindersList"),
  remindersPermissionHint: document.querySelector("#remindersPermissionHint"),
  addReminderButton: document.querySelector("#addReminderButton"),
  historyList: document.querySelector("#historyList"),
  stockDetails: document.querySelector("#stockDetails"),
  stockAlert: document.querySelector("#stockAlert"),
  routineList: document.querySelector("#routineList"),
  stockList: document.querySelector("#stockList"),
  todayLabel: document.querySelector("#todayLabel"),
  completionValue: document.querySelector("#completionValue"),
  completionBar: document.querySelector("#completionBar"),
  supplementCount: document.querySelector("#supplementCount"),
  openDoseCount: document.querySelector("#openDoseCount"),
  lowStockCount: document.querySelector("#lowStockCount"),
  pausedCount: document.querySelector("#pausedCount"),
  streakCount: document.querySelector("#streakCount"),
  undoToast: document.querySelector("#undoToast"),
  undoToastMessage: document.querySelector("#undoToastMessage"),
  undoToastButton: document.querySelector("#undoToastButton"),
  languageToggleButton: document.querySelector("#languageToggleButton"),
  themeToggleButton: document.querySelector("#themeToggleButton"),
};

applyTheme();
renderTemplateOptions();
renderTemplateCards();

elements.openFormButton.addEventListener("click", () => openSupplementForm());
elements.closeFormButton.addEventListener("click", closeSupplementForm);
elements.formPanel.querySelector("[data-close-form]").addEventListener("click", closeSupplementForm);
elements.appMenu.querySelector("summary").addEventListener("click", () => closeItemMenus());
elements.stockDetails.querySelector("summary").addEventListener("click", () => closeTransientMenus());
elements.closeRefillButton.addEventListener("click", closeRefillDialog);
elements.refillPanel.querySelector("[data-close-refill]").addEventListener("click", closeRefillDialog);
elements.closeBackupButton.addEventListener("click", closeBackupDialog);
elements.backupPanel.querySelector("[data-close-backup]").addEventListener("click", closeBackupDialog);
elements.closeRemindersButton.addEventListener("click", closeRemindersDialog);
elements.remindersPanel.querySelector("[data-close-reminders]").addEventListener("click", closeRemindersDialog);
elements.remindersButton.addEventListener("click", () => openRemindersDialog());
elements.addReminderButton.addEventListener("click", () => addReminder());
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && elements.formPanel.classList.contains("is-open")) {
    closeSupplementForm();
  }
  if (event.key === "Escape" && elements.refillPanel.classList.contains("is-open")) {
    closeRefillDialog();
  }
  if (event.key === "Escape" && elements.backupPanel.classList.contains("is-open")) {
    closeBackupDialog();
  }
  if (event.key === "Escape" && elements.remindersPanel.classList.contains("is-open")) {
    closeRemindersDialog();
  }
});

elements.templateInput.addEventListener("change", () => {
  const template = findTemplate(elements.templateInput.value);
  if (template) {
    fillForm(template);
  }
});

elements.timeToggleGroup.querySelectorAll(".time-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("is-selected");
  });
});

elements.customModeButton.addEventListener("click", () => {
  elements.templateCards.querySelectorAll(".template-card").forEach((card) => card.classList.remove("is-selected"));
  elements.templateInput.value = "";
  elements.templateInput.focus();
});

elements.showTodayButton.addEventListener("click", () => {
  document.querySelector(".content-grid").scrollIntoView({ behavior: "smooth" });
});

elements.resetDayButton.addEventListener("click", resetDay);
elements.undoToastButton.addEventListener("click", undoDelete);
elements.languageToggleButton.addEventListener("click", () => {
  setLanguage(currentLang === "de" ? "en" : "de");
});
elements.themeToggleButton.addEventListener("click", () => setTheme(currentTheme === "dark" ? "light" : "dark"));
elements.exportDataButton.addEventListener("click", () => openBackupDialog("export"));
elements.importDataButton.addEventListener("click", () => openBackupDialog("import"));
elements.importFileInput.addEventListener("change", importData);
elements.downloadBackupButton.addEventListener("click", downloadBackup);
elements.copyBackupButton.addEventListener("click", copyBackupText);
elements.chooseImportFileButton.addEventListener("click", () => elements.importFileInput.click());
elements.importBackupTextButton.addEventListener("click", importBackupText);

elements.supplementForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = {
    name: elements.templateInput.value.trim(),
    doseAmount: Math.max(0, toNumber(elements.doseAmountInput.value)),
    doseUnit: elements.doseUnitInput.value,
    times: getSelectedTimes(),
    stock: Math.max(0, toNumber(elements.stockInput.value)),
    initialStock: Math.max(0, toNumber(elements.stockInput.value)),
    stockUnit: elements.stockUnitInput.value,
    serving: Math.max(0.1, toNumber(elements.servingInput.value)),
  };

  if (!formData.name || !formData.times.length) {
    return;
  }

  const editId = elements.editIdInput.value;
  if (editId) {
    const index = state.supplements.findIndex((item) => item.id === editId);
    if (index >= 0) {
      const existing = state.supplements[index];
      const initialStock = formData.stock > existing.stock
        ? Math.max(formData.stock, existing.initialStock || formData.stock)
        : formData.stock;
      state.supplements[index] = {
        ...existing,
        ...formData,
        initialStock,
      };
    }
  } else {
    state.supplements.push(createSupplement(formData));
  }

  saveSupplements();
  closeSupplementForm();
  render();
});

elements.refillPanel.querySelectorAll("[data-refill-add]").forEach((button) => {
  button.addEventListener("click", () => applyRefill(button.dataset.refillAdd, "add"));
});
elements.refillPanel.querySelector("[data-refill-mode='full']").addEventListener("click", () => applyRefill(null, "full"));

elements.refillForm.addEventListener("submit", (event) => {
  event.preventDefault();
  applyRefill(elements.refillAmountInput.value, "add");
});

saveAll();
render();

if (isNativePlatform()) {
  elements.remindersButton.hidden = false;
  rescheduleReminders(loadReminders());
}

function render() {
  elements.todayLabel.textContent = new Intl.DateTimeFormat(dateLocale(), {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date());

  applyStaticTranslations();
  renderStats();
  renderHistory();
  renderRoutine();
  renderStock();
}

function renderStats() {
  const activeSupplements = activeItems();
  const slots = activeSlots();
  const total = slots.length;
  const done = checkedToday().length;
  const completion = total ? Math.round((done / total) * 100) : 0;
  const lowStock = activeSupplements.filter((item) => daysLeft(item) <= 7).length;
  const paused = pausedItems().length;

  elements.completionValue.textContent = `${completion}%`;
  elements.completionBar.style.width = `${completion}%`;
  elements.supplementCount.textContent = activeSupplements.length;
  elements.openDoseCount.textContent = Math.max(total - done, 0);
  elements.lowStockCount.textContent = lowStock;
  elements.pausedCount.textContent = paused;
  elements.streakCount.textContent = `${calculateStreak()}`;
  elements.stockDetails.classList.toggle("has-critical", lowStock > 0);
  if (lowStock > 0) {
    elements.stockDetails.open = true;
  }
  renderCompletionState(total, done);
}

function renderCompletionState(total, done) {
  const existing = document.querySelector(".completion-state");
  if (existing) {
    existing.remove();
  }

  if (!total || done !== total) {
    return;
  }

  const stateNode = document.createElement("div");
  stateNode.className = "completion-state";
  stateNode.innerHTML = `
    <span class="completion-check">✓</span>
    <div>
      <strong>${t("completionTitle")}</strong>
      <span>${t("completionBody")}</span>
    </div>
  `;
  document.querySelector(".daily-summary").append(stateNode);
}

function renderRoutine() {
  elements.routineList.innerHTML = "";

  if (!state.supplements.length) {
    elements.routineList.innerHTML = `
      <div class="empty-state">
        <strong>${t("emptyNoSupplementsTitle")}</strong>
        <p>${t("emptyNoSupplementsBody")}</p>
        <button id="emptyStateAddButton" class="primary-button" type="button">${t("emptyAddButton")}</button>
      </div>
    `;
    elements.routineList.querySelector("#emptyStateAddButton").addEventListener("click", () => openSupplementForm());
    return;
  }

  if (!activeItems().length) {
    elements.routineList.innerHTML = `
      <div class="empty-state">
        <strong>${t("emptyAllPausedTitle")}</strong>
        <p>${t("emptyAllPausedBody")}</p>
      </div>
    `;
    return;
  }

  const groups = groupSlotsByTime(activeSlots());
  groups.forEach(([time, slots]) => {
    const group = document.createElement("section");
    group.className = "routine-group";
    const allDone = slots.every((slot) => checkedToday().includes(slot.checkId));
    const showCheckAll = slots.length > 1 && !allDone;
    group.innerHTML = `
      <h3>
        <span class="group-title">${timeIcon(time)}<span>${escapeHTML(timeLabel(time))}</span></span>
        ${showCheckAll ? `<button type="button" class="check-all-button" data-check-all="${escapeHTML(time)}">${t("checkAllGroup")}</button>` : ""}
      </h3>
    `;

    slots.forEach((slot) => {
      const item = slot.supplement;
      const isDone = checkedToday().includes(slot.checkId);
      const row = document.createElement("article");
      row.className = `routine-item ${isDone ? "is-done" : ""}`;
      row.innerHTML = `
        <div>
          <p class="routine-title">${escapeHTML(item.name)}</p>
          <p class="routine-meta">${formatDose(item)} · ${t("daysLeft", daysLeft(item))}</p>
        </div>
        <div class="item-actions">
          <button class="check-button" data-check-id="${slot.checkId}" type="button" aria-label="${escapeHTML(t("markAsTaken", item.name))}">
            <span class="check-icon">${isDone ? "✓" : ""}</span>
            <span>${isDone ? t("done") : t("taken")}</span>
          </button>
          <details class="item-menu">
            <summary aria-label="${escapeHTML(t("itemActions", item.name))}">•••</summary>
            <div class="menu-popover">
              <button data-edit-id="${item.id}" type="button">${t("edit")}</button>
              <button data-pause-id="${item.id}" type="button">${t("pause")}</button>
              <button class="danger-action" data-delete-id="${item.id}" type="button">${t("deleteAction")}</button>
            </div>
          </details>
        </div>
      `;
      group.append(row);
    });

    elements.routineList.append(group);
  });

  elements.routineList.querySelectorAll("[data-check-id]").forEach((button) => {
    button.addEventListener("click", () => toggleCheck(button.dataset.checkId));
  });
  elements.routineList.querySelectorAll("[data-edit-id]").forEach((button) => {
    button.addEventListener("click", () => editSupplement(button.dataset.editId));
  });
  elements.routineList.querySelectorAll("[data-pause-id]").forEach((button) => {
    button.addEventListener("click", () => togglePause(button.dataset.pauseId));
  });
  elements.routineList.querySelectorAll("[data-delete-id]").forEach((button) => {
    button.addEventListener("click", () => deleteSupplement(button.dataset.deleteId));
  });
  elements.routineList.querySelectorAll("[data-check-all]").forEach((button) => {
    button.addEventListener("click", () => checkAllForTime(button.dataset.checkAll));
  });
}

function renderStock() {
  elements.stockList.innerHTML = "";
  elements.stockAlert.innerHTML = "";

  if (!state.supplements.length) {
    elements.stockList.innerHTML = `
      <div class="empty-state">
        <p>${t("emptyStock")}</p>
      </div>
    `;
    return;
  }

  const sorted = [...state.supplements].sort((a, b) => daysLeft(a) - daysLeft(b));
  const lowItems = sorted.filter((item) => !item.paused && daysLeft(item) <= 7);

  if (lowItems.length) {
    elements.stockAlert.innerHTML = `
      <strong>${t("almostEmpty", lowItems.length)}</strong>
      <span>${lowItems.map((item) => escapeHTML(item.name)).join(", ")}</span>
    `;
  }

  sorted.forEach((item) => {
    const percent = stockPercent(item);
    const remainingDays = daysLeft(item);
    const statusText = item.paused ? t("statusPaused") : remainingDays <= 7 ? t("statusLow") : t("statusStable");
    const statusClass = item.paused ? "is-paused" : remainingDays <= 7 ? "is-low" : "is-stable";
    const row = document.createElement("article");
    row.className = `stock-item ${statusClass}`;
    row.innerHTML = `
      <div class="stock-header">
        <div>
          <p class="stock-title">${escapeHTML(item.name)}</p>
          <p class="stock-meta">${t("stockRemaining", formatStock(item), formatServing(item))}</p>
        </div>
        <div class="stock-actions">
          <span class="stock-status ${statusClass}">${statusText}</span>
          <strong>${t("daysUnit", remainingDays)}</strong>
        </div>
      </div>
      <div class="stock-track">
        <div class="stock-bar ${remainingDays <= 7 ? "is-low" : ""}" style="width: ${percent}%"></div>
      </div>
      <div class="stock-controls">
        <button class="refill-button" data-refill-id="${item.id}" type="button">${t("refill")}</button>
        <button class="refill-button subtle" data-pause-id="${item.id}" type="button">${item.paused ? t("activate") : t("pause")}</button>
      </div>
    `;
    elements.stockList.append(row);
  });

  elements.stockList.querySelectorAll("[data-refill-id]").forEach((button) => {
    button.addEventListener("click", () => openRefillDialog(button.dataset.refillId));
  });
  elements.stockList.querySelectorAll("[data-pause-id]").forEach((button) => {
    button.addEventListener("click", () => togglePause(button.dataset.pauseId));
  });
}

function renderHistory() {
  elements.historyList.innerHTML = "";
  const total = activeSlots().length;
  const weeksToShow = 14;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const mondayOffset = (today.getDay() + 6) % 7;
  const gridStart = new Date(today);
  gridStart.setDate(gridStart.getDate() - mondayOffset - (weeksToShow - 1) * 7);

  for (let i = 0; i < weeksToShow * 7; i += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    const isFuture = date > today;
    const key = toDateKey(date);
    const checks = state.checks[key] || [];
    const completion = total ? Math.round((checks.length / total) * 100) : 0;
    const cell = document.createElement("span");
    cell.className = `heatmap-cell level-${isFuture ? 0 : completionLevel(completion)}${isFuture ? " is-future" : ""}`;
    if (!isFuture) {
      const dateLabel = new Intl.DateTimeFormat(dateLocale(), { day: "2-digit", month: "short" }).format(date);
      cell.title = `${dateLabel}: ${completion}%`;
    }
    elements.historyList.append(cell);
  }
}

function completionLevel(completion) {
  if (completion >= 100) {
    return 3;
  }
  if (completion >= 50) {
    return 2;
  }
  if (completion > 0) {
    return 1;
  }
  return 0;
}

function openSupplementForm(item = null) {
  closeTransientMenus();
  elements.formPanel.classList.add("is-open");
  elements.formPanel.setAttribute("aria-hidden", "false");
  elements.supplementForm.reset();
  elements.servingInput.value = "1";

  if (item) {
    elements.formTitle.textContent = t("editSupplementTitle");
    elements.saveSupplementButton.textContent = t("saveChanges");
    elements.editIdInput.value = item.id;
    fillForm(item);
  } else {
    elements.formTitle.textContent = t("addSupplementTitle");
    elements.saveSupplementButton.textContent = t("save");
    elements.editIdInput.value = "";
    const template = supplementTemplates[0];
    elements.templateInput.value = "";
    elements.doseAmountInput.value = template.doseAmount;
    elements.doseUnitInput.value = template.doseUnit;
    setSelectedTimes([template.time]);
    elements.stockInput.value = template.stock;
    elements.stockUnitInput.value = template.stockUnit;
    elements.servingInput.value = template.serving;
  }

  const formScroller = elements.formPanel.querySelector(".modal-panel");
  formScroller.scrollTop = 0;
  elements.closeFormButton.focus({ preventScroll: true });
}

function closeSupplementForm() {
  elements.formPanel.classList.remove("is-open");
  elements.formPanel.setAttribute("aria-hidden", "true");
}

function openRefillDialog(id) {
  const supplement = state.supplements.find((item) => item.id === id);
  if (!supplement) {
    return;
  }

  closeTransientMenus();
  elements.refillIdInput.value = id;
  elements.refillAmountInput.value = "";
  elements.refillDescription.textContent = t("refillDescription", supplement.name, formatStock(supplement));
  elements.refillPanel.classList.add("is-open");
  elements.refillPanel.setAttribute("aria-hidden", "false");
  elements.refillAmountInput.focus();
}

function closeRefillDialog() {
  elements.refillPanel.classList.remove("is-open");
  elements.refillPanel.setAttribute("aria-hidden", "true");
}

function openBackupDialog(mode) {
  closeTransientMenus();
  elements.backupPanel.classList.add("is-open");
  elements.backupPanel.setAttribute("aria-hidden", "false");

  if (mode === "import") {
    elements.backupTextArea.value = "";
    elements.backupHint.textContent = t("backupHintImport");
    elements.backupTextArea.placeholder = t("backupTextPlaceholder");
    elements.backupTextArea.focus();
    return;
  }

  elements.backupTextArea.value = JSON.stringify(createBackupPayload(), null, 2);
  elements.backupHint.textContent = t("backupHintExport");
  elements.backupTextArea.placeholder = "";
  elements.backupTextArea.select();
}

function closeBackupDialog() {
  elements.backupPanel.classList.remove("is-open");
  elements.backupPanel.setAttribute("aria-hidden", "true");
}

function isNativePlatform() {
  return Boolean(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
}

function getLocalNotifications() {
  return window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications;
}

function loadReminders() {
  return loadJSON(REMINDERS_KEY, ["09:00"]);
}

function saveReminders(reminders) {
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
  rescheduleReminders(reminders);
}

function reminderMessageForTime(hhmm) {
  const hour = Number.parseInt(hhmm.split(":")[0], 10);
  if (hour < 11) {
    return t("reminderMorning");
  }
  if (hour < 17) {
    return t("reminderMidday");
  }
  return t("reminderEvening");
}

async function rescheduleReminders(reminders) {
  const LocalNotifications = getLocalNotifications();
  if (!LocalNotifications) {
    return;
  }

  const pending = await LocalNotifications.getPending();
  const ourIds = pending.notifications
    .map((notification) => notification.id)
    .filter((id) => id >= REMINDER_ID_BASE && id < REMINDER_ID_BASE + 1000);
  if (ourIds.length) {
    await LocalNotifications.cancel({ notifications: ourIds.map((id) => ({ id })) });
  }

  if (!reminders.length) {
    return;
  }

  await LocalNotifications.schedule({
    notifications: reminders.map((time, index) => {
      const [hour, minute] = time.split(":").map((part) => Number.parseInt(part, 10));
      return {
        id: REMINDER_ID_BASE + index,
        title: "Capsl",
        body: reminderMessageForTime(time),
        schedule: { on: { hour, minute }, allowWhileIdle: true },
      };
    }),
  });
}

async function ensureNotificationPermission() {
  const LocalNotifications = getLocalNotifications();
  if (!LocalNotifications) {
    return false;
  }

  const current = await LocalNotifications.checkPermissions();
  if (current.display === "granted") {
    elements.remindersPermissionHint.hidden = true;
    return true;
  }

  const requested = await LocalNotifications.requestPermissions();
  const granted = requested.display === "granted";
  elements.remindersPermissionHint.hidden = granted;
  return granted;
}

function renderReminders() {
  const reminders = loadReminders();
  elements.remindersList.innerHTML = "";

  reminders.forEach((time, index) => {
    const row = document.createElement("div");
    row.className = "reminder-row";
    row.innerHTML = `
      <input type="time" value="${time}" data-reminder-index="${index}">
      <button type="button" class="ghost-button icon-button" data-remove-reminder="${index}" aria-label="${escapeHTML(t("deleteReminder"))}">×</button>
    `;
    elements.remindersList.append(row);
  });

  elements.remindersList.querySelectorAll("[data-reminder-index]").forEach((input) => {
    input.addEventListener("change", () => {
      const list = loadReminders();
      list[Number(input.dataset.reminderIndex)] = input.value;
      saveReminders(list);
    });
  });

  elements.remindersList.querySelectorAll("[data-remove-reminder]").forEach((button) => {
    button.addEventListener("click", () => {
      const list = loadReminders();
      list.splice(Number(button.dataset.removeReminder), 1);
      saveReminders(list);
      renderReminders();
    });
  });
}

async function addReminder() {
  const list = loadReminders();
  const nextPreset = REMINDER_TIME_PRESETS.find((preset) => !list.includes(preset));
  list.push(nextPreset || "09:00");
  saveReminders(list);
  renderReminders();
  await ensureNotificationPermission();
}

async function openRemindersDialog() {
  closeTransientMenus();
  elements.remindersPanel.classList.add("is-open");
  elements.remindersPanel.setAttribute("aria-hidden", "false");
  renderReminders();
  await ensureNotificationPermission();
}

function closeRemindersDialog() {
  elements.remindersPanel.classList.remove("is-open");
  elements.remindersPanel.setAttribute("aria-hidden", "true");
}

function closeTransientMenus() {
  elements.appMenu.open = false;
  closeItemMenus();
}

function closeItemMenus() {
  document.querySelectorAll(".item-menu[open]").forEach((menu) => {
    menu.open = false;
  });
}

function fillForm(source) {
  elements.templateInput.value = source.name;
  elements.doseAmountInput.value = source.doseAmount;
  elements.doseUnitInput.value = source.doseUnit;
  setSelectedTimes(source.times || (source.time ? [source.time] : []));
  elements.stockInput.value = source.stock;
  elements.stockUnitInput.value = source.stockUnit;
  elements.servingInput.value = source.serving;
}

function setSelectedTimes(times) {
  const selected = new Set(times);
  elements.timeToggleGroup.querySelectorAll(".time-toggle").forEach((button) => {
    button.classList.toggle("is-selected", selected.has(button.dataset.time));
  });
}

function getSelectedTimes() {
  return Array.from(elements.timeToggleGroup.querySelectorAll(".time-toggle.is-selected")).map(
    (button) => button.dataset.time
  );
}

function renderTemplateOptions() {
  elements.templateOptions.innerHTML = supplementTemplates
    .map((template) => `<option value="${escapeHTML(template.name)}"></option>`)
    .join("");
}

function renderTemplateCards() {
  elements.templateCards.innerHTML = supplementTemplates
    .map((template) => `
      <button class="template-card" type="button" data-template-name="${escapeHTML(template.name)}">
        <strong>${escapeHTML(template.name)}</strong>
        <span>${formatNumber(template.doseAmount)} ${unitLabel(template.doseUnit, template.doseAmount)} · ${escapeHTML(timeLabel(template.time))}</span>
      </button>
    `)
    .join("");

  elements.templateCards.querySelectorAll("[data-template-name]").forEach((button) => {
    button.addEventListener("click", () => {
      const template = findTemplate(button.dataset.templateName);
      if (template) {
        fillForm(template);
        elements.templateCards.querySelectorAll(".template-card").forEach((card) => card.classList.toggle("is-selected", card === button));
      }
    });
  });
}

function findTemplate(value) {
  const normalized = value.trim().toLowerCase();
  return supplementTemplates.find((template) => template.name.toLowerCase() === normalized);
}

function editSupplement(id) {
  const supplement = state.supplements.find((item) => item.id === id);
  if (supplement) {
    openSupplementForm(supplement);
  }
}

function toggleCheck(checkId) {
  const supplementId = checkId.split("::")[0];
  const checks = checkedToday();
  const supplement = state.supplements.find((item) => item.id === supplementId);
  const isDone = checks.includes(checkId);

  if (!supplement) {
    return;
  }

  state.checks[todayKey] = isDone
    ? checks.filter((id) => id !== checkId)
    : [...new Set([...checks, checkId])];

  if (isDone) {
    undoStockFor(supplementId);
  } else {
    supplement.stock = Math.max(0, supplement.stock - supplement.serving);
  }

  saveAll();
  render();
}

function checkAllForTime(time) {
  const checks = checkedToday();
  const pending = activeSlots().filter((slot) => slot.time === time && !checks.includes(slot.checkId));

  if (!pending.length) {
    return;
  }

  pending.forEach((slot) => {
    slot.supplement.stock = Math.max(0, slot.supplement.stock - slot.supplement.serving);
  });

  state.checks[todayKey] = [...new Set([...checks, ...pending.map((slot) => slot.checkId)])];

  saveAll();
  render();
}

function resetDay() {
  checkedToday().forEach((checkId) => undoStockFor(checkId.split("::")[0]));
  state.checks[todayKey] = [];
  elements.appMenu.open = false;
  saveAll();
  render();
}

function undoStockFor(id) {
  const supplement = state.supplements.find((item) => item.id === id);
  if (!supplement) {
    return;
  }

  supplement.stock = Math.min(supplement.initialStock || supplement.stock, supplement.stock + supplement.serving);
}

function deleteSupplement(id) {
  const index = state.supplements.findIndex((item) => item.id === id);
  if (index === -1) {
    return;
  }

  finalizePendingDelete();

  const [supplement] = state.supplements.splice(index, 1);
  const removedChecks = {};
  Object.keys(state.checks).forEach((dateKey) => {
    const removed = state.checks[dateKey].filter((checkId) => isCheckForSupplement(checkId, id));
    if (removed.length) {
      removedChecks[dateKey] = removed;
    }
    state.checks[dateKey] = state.checks[dateKey].filter((checkId) => !isCheckForSupplement(checkId, id));
  });

  saveAll();
  render();
  showUndoToast(supplement, index, removedChecks);
}

function showUndoToast(supplement, index, removedChecks) {
  pendingDelete = { supplement, index, removedChecks };
  elements.undoToastMessage.textContent = t("deletedToast", supplement.name);
  elements.undoToast.hidden = false;
  pendingDeleteTimer = setTimeout(finalizePendingDelete, 6000);
}

function undoDelete() {
  if (!pendingDelete) {
    return;
  }

  const { supplement, index, removedChecks } = pendingDelete;
  state.supplements.splice(Math.min(index, state.supplements.length), 0, supplement);
  Object.entries(removedChecks).forEach(([dateKey, ids]) => {
    state.checks[dateKey] = [...new Set([...(state.checks[dateKey] || []), ...ids])];
  });

  clearTimeout(pendingDeleteTimer);
  pendingDelete = null;
  elements.undoToast.hidden = true;

  saveAll();
  render();
}

function finalizePendingDelete() {
  clearTimeout(pendingDeleteTimer);
  pendingDelete = null;
  elements.undoToast.hidden = true;
}

function togglePause(id) {
  const supplement = state.supplements.find((item) => item.id === id);
  if (!supplement) {
    return;
  }

  supplement.paused = !supplement.paused;
  if (supplement.paused) {
    state.checks[todayKey] = (state.checks[todayKey] || []).filter(
      (checkId) => !isCheckForSupplement(checkId, id)
    );
  }
  saveAll();
  render();
}

function isCheckForSupplement(checkId, supplementId) {
  return checkId === supplementId || checkId.startsWith(`${supplementId}::`);
}

function applyRefill(value, mode) {
  const id = elements.refillIdInput.value;
  const supplement = state.supplements.find((item) => item.id === id);
  if (!supplement) {
    return;
  }

  if (mode === "full") {
    const refillAmount = supplement.initialStock || supplement.serving * 30;
    supplement.stock = refillAmount;
  } else {
    const amount = toNumber(value);
    if (amount <= 0) {
      return;
    }
    supplement.stock += amount;
    supplement.initialStock = Math.max(supplement.initialStock || 0, supplement.stock);
  }

  saveSupplements();
  closeRefillDialog();
  render();
}

function activeSlots() {
  return activeItems().flatMap((item) =>
    (item.times || []).map((time) => ({ supplement: item, time, checkId: `${item.id}::${time}` }))
  );
}

function groupSlotsByTime(slots) {
  const order = ["Morgens", "Mittags", "Abends", "Vor dem Training", "Nach dem Training"];
  return order
    .map((time) => [time, slots.filter((slot) => slot.time === time)])
    .filter(([, items]) => items.length);
}

function timeIcon(time) {
  const icons = {
    Morgens:
      '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3v4M4.2 10.2l1.4 1.4M19.8 10.2l-1.4 1.4M2 18h20M6 18a6 6 0 0 1 12 0"/></svg>',
    Mittags:
      '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    Abends:
      '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/></svg>',
    "Vor dem Training":
      '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/></svg>',
    "Nach dem Training":
      '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9v6M20 9v6M2 12h2M20 12h2M7 7v10M17 7v10M7 12h10"/></svg>',
  };

  return icons[time] || "";
}

function activeItems() {
  return state.supplements.filter((item) => !item.paused);
}

function pausedItems() {
  return state.supplements.filter((item) => item.paused);
}

function calculateStreak() {
  let streak = 0;
  const date = new Date();

  if (isDayComplete(toDateKey(date))) {
    streak += 1;
  }
  date.setDate(date.getDate() - 1);

  while (isDayComplete(toDateKey(date))) {
    streak += 1;
    date.setDate(date.getDate() - 1);
  }

  return streak;
}

function isDayComplete(key) {
  const checks = state.checks[key] || [];
  const slots = activeSlots();
  return slots.length > 0 && slots.every((slot) => checks.includes(slot.checkId));
}

function checkedToday() {
  const activeIds = new Set(activeSlots().map((slot) => slot.checkId));
  return (state.checks[todayKey] || []).filter((id) => activeIds.has(id));
}

function stockPercent(item) {
  if (!item.initialStock) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round((item.stock / item.initialStock) * 100)));
}

function daysLeft(item) {
  const serving = Math.max(0.1, item.serving || 1);
  return Math.floor((item.stock || 0) / serving);
}

function formatDose(item) {
  return `${formatNumber(item.doseAmount)} ${unitLabel(item.doseUnit, item.doseAmount)}`;
}

function formatStock(item) {
  return `${formatNumber(item.stock)} ${stockUnitLabel(item.stockUnit, item.stock)}`;
}

function formatServing(item) {
  return `${formatNumber(item.serving)} ${stockUnitLabel(item.stockUnit, item.serving)}`;
}

function unitLabel(unit, amount) {
  const entry = (UNIT_LABELS[currentLang] && UNIT_LABELS[currentLang][unit]) || { singular: unit, plural: unit };
  return Number(amount) === 1 ? entry.singular : entry.plural;
}

function stockUnitLabel(unit, amount) {
  const doseUnit = STOCK_UNIT_TO_DOSE_UNIT[unit] || unit;
  const entry = (UNIT_LABELS[currentLang] && UNIT_LABELS[currentLang][doseUnit]) || { singular: unit, plural: unit };
  return Number(amount) === 1 ? entry.singular : entry.plural;
}

function createSupplement(source) {
  return {
    id: source.id || crypto.randomUUID(),
    name: source.name,
    doseAmount: Math.max(0, toNumber(source.doseAmount)),
    doseUnit: source.doseUnit || "Kapsel",
    times: normalizeTimes(source.times || source.time),
    stock: Math.max(0, toNumber(source.stock)),
    initialStock: Math.max(0, toNumber(source.initialStock ?? source.stock)),
    stockUnit: source.stockUnit || "Kapseln",
    serving: Math.max(0.1, toNumber(source.serving || 1)),
    paused: Boolean(source.paused),
  };
}

function normalizeTimes(value) {
  if (Array.isArray(value) && value.length) {
    return value;
  }
  if (typeof value === "string" && value) {
    return [value];
  }
  return ["Morgens"];
}

function normalizeSupplements(items) {
  return items.map((item) => {
    if ("doseAmount" in item) {
      return createSupplement(item);
    }

    const parsed = parseLegacyDose(item.dose || "1 Kapsel");
    return createSupplement({
      ...item,
      doseAmount: parsed.amount,
      doseUnit: parsed.unit,
      stockUnit: stockUnitFromDose(parsed.unit),
      serving: item.serving || parsed.amount || 1,
    });
  });
}

function migrateChecks(checks, supplements) {
  const byId = new Map(supplements.map((item) => [item.id, item]));
  const migrated = {};

  Object.entries(checks).forEach(([dateKey, ids]) => {
    migrated[dateKey] = ids.map((id) => {
      if (id.includes("::")) {
        return id;
      }
      const supplement = byId.get(id);
      if (supplement && supplement.times && supplement.times.length) {
        return `${id}::${supplement.times[0]}`;
      }
      return id;
    });
  });

  return migrated;
}

function createBackupPayload() {
  return {
    app: "Capsl",
    version: 1,
    exportedAt: new Date().toISOString(),
    supplements: state.supplements,
    checks: state.checks,
  };
}

function downloadBackup() {
  const text = elements.backupTextArea.value.trim() || JSON.stringify(createBackupPayload(), null, 2);

  try {
    const payload = JSON.parse(text);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `capsl-backup-${todayKey}.json`;
    link.click();
    URL.revokeObjectURL(url);
    elements.backupHint.textContent = t("backupFilePrepared");
  } catch (error) {
    elements.backupHint.textContent = t("backupDownloadFailed");
  }
}

async function copyBackupText() {
  if (!elements.backupTextArea.value.trim()) {
    elements.backupTextArea.value = JSON.stringify(createBackupPayload(), null, 2);
  }

  const text = elements.backupTextArea.value;

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      elements.backupHint.textContent = t("backupCopied");
      return;
    } catch (error) {
      // fall through to legacy copy
    }
  }

  elements.backupTextArea.select();
  document.execCommand("copy");
  elements.backupHint.textContent = t("backupCopiedFallback");
}

function importBackupText() {
  try {
    applyImportedPayload(JSON.parse(elements.backupTextArea.value));
    elements.backupHint.textContent = t("backupImported");
    closeBackupDialog();
  } catch (error) {
    elements.backupHint.textContent = t("backupImportFailed");
  }
}

async function importData(event) {
  const [file] = event.target.files;
  if (!file) {
    return;
  }

  try {
    applyImportedPayload(JSON.parse(await file.text()));
    closeBackupDialog();
  } catch (error) {
    alert(t("fileImportFailed"));
  } finally {
    elements.importFileInput.value = "";
  }
}

function applyImportedPayload(payload) {
  if (!payload || !Array.isArray(payload.supplements) || typeof payload.checks !== "object") {
    throw new Error("Invalid Capsl backup");
  }

  state.supplements = normalizeSupplements(payload.supplements);
  state.checks = payload.checks || {};
  saveAll();
  render();
}

function parseLegacyDose(dose) {
  const match = dose.match(/([\d.,]+)\s*(.*)/);
  const amount = match ? toNumber(match[1]) : 1;
  const rawUnit = match ? match[2].trim() : "Kapsel";
  const unitMap = {
    Kapseln: "Kapsel",
    Kapsel: "Kapsel",
    Tabletten: "Tablette",
    Tablette: "Tablette",
    Scoops: "Scoop",
    Scoop: "Scoop",
    Tropfen: "Tropfen",
    Portionen: "Portion",
    Portion: "Portion",
    g: "g",
    mg: "mg",
  };

  return { amount, unit: unitMap[rawUnit] || rawUnit || "Kapsel" };
}

function stockUnitFromDose(unit) {
  const map = {
    Kapsel: "Kapseln",
    Tablette: "Tabletten",
    Scoop: "Scoops",
    Portion: "Portionen",
    Tropfen: "Tropfen",
    g: "g",
    mg: "mg",
  };

  return map[unit] || "Einheiten";
}

function saveAll() {
  saveSupplements();
  saveChecks();
}

function saveSupplements() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.supplements));
}

function saveChecks() {
  localStorage.setItem(CHECKS_KEY, JSON.stringify(state.checks));
}

function loadFirst(keys, fallback) {
  for (const key of keys) {
    const value = loadJSON(key, null);
    if (value) {
      return value;
    }
  }

  return fallback;
}

function loadJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function toNumber(value) {
  const number = Number.parseFloat(String(value).replace(",", "."));
  return Number.isFinite(number) ? number : 0;
}

function formatNumber(value) {
  return new Intl.NumberFormat("de-DE", {
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });
}
