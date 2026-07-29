if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

const STORAGE_KEY = "capsl-supplements-v1";
const CHECKS_KEY = "capsl-checks-v1";
const OLD_STORAGE_KEYS = ["supproutine-supplements-v2", "supproutine-supplements-v1", "coredose-supplements-v1"];
const OLD_CHECK_KEYS = ["supproutine-checks-v2", "supproutine-checks-v1", "coredose-checks-v1"];

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
};

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
    doseAmount: toNumber(elements.doseAmountInput.value),
    doseUnit: elements.doseUnitInput.value,
    times: getSelectedTimes(),
    stock: toNumber(elements.stockInput.value),
    initialStock: toNumber(elements.stockInput.value),
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

function render() {
  elements.todayLabel.textContent = new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date());

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
      <strong>Heute abgeschlossen</strong>
      <span>Dein Stack ist erledigt.</span>
    </div>
  `;
  document.querySelector(".daily-summary").append(stateNode);
}

function renderRoutine() {
  elements.routineList.innerHTML = "";

  if (!state.supplements.length) {
    elements.routineList.innerHTML = `
      <div class="empty-state">
        <strong>Noch nichts eingetragen</strong>
        <p>Leg dein erstes Supplement an und starte deine Routine.</p>
        <button id="emptyStateAddButton" class="primary-button" type="button">+ Supplement hinzufügen</button>
      </div>
    `;
    elements.routineList.querySelector("#emptyStateAddButton").addEventListener("click", () => openSupplementForm());
    return;
  }

  if (!activeItems().length) {
    elements.routineList.innerHTML = `
      <div class="empty-state">
        <strong>Alle Supplements pausiert</strong>
        <p>Aktiviere eins im Vorrat, um es wieder in deiner Routine zu sehen.</p>
      </div>
    `;
    return;
  }

  const groups = groupSlotsByTime(activeSlots());
  groups.forEach(([time, slots]) => {
    const group = document.createElement("section");
    group.className = "routine-group";
    group.innerHTML = `<h3>${timeIcon(time)}<span>${escapeHTML(time)}</span></h3>`;

    slots.forEach((slot) => {
      const item = slot.supplement;
      const isDone = checkedToday().includes(slot.checkId);
      const row = document.createElement("article");
      row.className = `routine-item ${isDone ? "is-done" : ""}`;
      row.innerHTML = `
        <div>
          <p class="routine-title">${escapeHTML(item.name)}</p>
          <p class="routine-meta">${formatDose(item)} · reicht noch ${daysLeft(item)} Tage</p>
        </div>
        <div class="item-actions">
          <button class="check-button" data-check-id="${slot.checkId}" type="button" aria-label="${item.name} als eingenommen markieren">
            <span class="check-icon">${isDone ? "✓" : ""}</span>
            <span>${isDone ? "Erledigt" : "Eingenommen"}</span>
          </button>
          <details class="item-menu">
            <summary aria-label="${item.name} Aktionen">•••</summary>
            <div class="menu-popover">
              <button data-edit-id="${item.id}" type="button">Bearbeiten</button>
              <button data-pause-id="${item.id}" type="button">Pausieren</button>
              <button class="danger-action" data-delete-id="${item.id}" type="button">Löschen</button>
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
}

function renderStock() {
  elements.stockList.innerHTML = "";
  elements.stockAlert.innerHTML = "";

  if (!state.supplements.length) {
    elements.stockList.innerHTML = `
      <div class="empty-state">
        <p>Vorrat erscheint hier, sobald du dein erstes Supplement anlegst.</p>
      </div>
    `;
    return;
  }

  const sorted = [...state.supplements].sort((a, b) => daysLeft(a) - daysLeft(b));
  const lowItems = sorted.filter((item) => !item.paused && daysLeft(item) <= 7);

  if (lowItems.length) {
    elements.stockAlert.innerHTML = `
      <strong>${lowItems.length} bald leer</strong>
      <span>${lowItems.map((item) => escapeHTML(item.name)).join(", ")}</span>
    `;
  }

  sorted.forEach((item) => {
    const percent = stockPercent(item);
    const remainingDays = daysLeft(item);
    const statusText = item.paused ? "Pausiert" : remainingDays <= 7 ? "Knapp" : "Stabil";
    const statusClass = item.paused ? "is-paused" : remainingDays <= 7 ? "is-low" : "is-stable";
    const row = document.createElement("article");
    row.className = `stock-item ${statusClass}`;
    row.innerHTML = `
      <div class="stock-header">
        <div>
          <p class="stock-title">${escapeHTML(item.name)}</p>
          <p class="stock-meta">${formatStock(item)} übrig · ${formatServing(item)} pro Einnahme</p>
        </div>
        <div class="stock-actions">
          <span class="stock-status ${statusClass}">${statusText}</span>
          <strong>${remainingDays} Tage</strong>
        </div>
      </div>
      <div class="stock-track">
        <div class="stock-bar ${remainingDays <= 7 ? "is-low" : ""}" style="width: ${percent}%"></div>
      </div>
      <div class="stock-controls">
        <button class="refill-button" data-refill-id="${item.id}" type="button">Auffüllen</button>
        <button class="refill-button subtle" data-pause-id="${item.id}" type="button">${item.paused ? "Aktivieren" : "Pausieren"}</button>
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

  for (let index = 6; index >= 0; index -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - index);
    const key = toDateKey(date);
    const checks = state.checks[key] || [];
    const completion = total ? Math.round((checks.length / total) * 100) : 0;
    const isComplete = total > 0 && completion >= 100;
    const day = document.createElement("article");
    day.className = `history-day ${isComplete ? "is-complete" : ""}`;
    day.innerHTML = `
      <span>${new Intl.DateTimeFormat("de-DE", { weekday: "short" }).format(date)}</span>
      <strong>${completion}%</strong>
    `;
    elements.historyList.append(day);
  }
}

function openSupplementForm(item = null) {
  closeTransientMenus();
  elements.formPanel.classList.add("is-open");
  elements.formPanel.setAttribute("aria-hidden", "false");
  elements.supplementForm.reset();
  elements.servingInput.value = "1";

  if (item) {
    elements.formTitle.textContent = "Supplement bearbeiten";
    elements.saveSupplementButton.textContent = "Änderungen speichern";
    elements.editIdInput.value = item.id;
    fillForm(item);
  } else {
    elements.formTitle.textContent = "Supplement hinzufügen";
    elements.saveSupplementButton.textContent = "Speichern";
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
  elements.refillDescription.textContent = `${supplement.name}: aktuell ${formatStock(supplement)} übrig.`;
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
    elements.backupHint.textContent = "Füge ein Capsl-Backup ein oder wähle eine JSON-Datei.";
    elements.backupTextArea.placeholder = "Backup-Text hier einfügen...";
    elements.backupTextArea.focus();
    return;
  }

  elements.backupTextArea.value = JSON.stringify(createBackupPayload(), null, 2);
  elements.backupHint.textContent = "Kopiere dein Backup oder lade es als Datei herunter.";
  elements.backupTextArea.placeholder = "";
  elements.backupTextArea.select();
}

function closeBackupDialog() {
  elements.backupPanel.classList.remove("is-open");
  elements.backupPanel.setAttribute("aria-hidden", "true");
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
        <span>${formatNumber(template.doseAmount)} ${unitLabel(template.doseUnit, template.doseAmount)} · ${escapeHTML(template.time)}</span>
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
  const supplement = state.supplements.find((item) => item.id === id);
  if (!supplement) {
    return;
  }

  if (!confirm(`"${supplement.name}" wirklich löschen? Das kann nicht rückgängig gemacht werden.`)) {
    return;
  }

  state.supplements = state.supplements.filter((item) => item.id !== id);
  Object.keys(state.checks).forEach((dateKey) => {
    state.checks[dateKey] = state.checks[dateKey].filter((checkId) => !isCheckForSupplement(checkId, id));
  });
  saveAll();
  render();
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
  if (Number(amount) === 1) {
    return unit;
  }

  const plurals = {
    Kapsel: "Kapseln",
    Tablette: "Tabletten",
    Scoop: "Scoops",
    Portion: "Portionen",
  };

  return plurals[unit] || unit;
}

function stockUnitLabel(unit, amount) {
  if (Number(amount) !== 1) {
    return unit;
  }

  const singulars = {
    Kapseln: "Kapsel",
    Tabletten: "Tablette",
    Scoops: "Scoop",
    Portionen: "Portion",
  };

  return singulars[unit] || unit;
}

function createSupplement(source) {
  return {
    id: source.id || crypto.randomUUID(),
    name: source.name,
    doseAmount: toNumber(source.doseAmount),
    doseUnit: source.doseUnit || "Kapsel",
    times: normalizeTimes(source.times || source.time),
    stock: toNumber(source.stock),
    initialStock: toNumber(source.initialStock ?? source.stock),
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
    elements.backupHint.textContent = "Backup-Datei wurde vorbereitet.";
  } catch (error) {
    elements.backupHint.textContent = "Download fehlgeschlagen. Bitte prüfe den Backup-Text.";
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
      elements.backupHint.textContent = "Backup-Text wurde kopiert.";
      return;
    } catch (error) {
      // fall through to legacy copy
    }
  }

  elements.backupTextArea.select();
  document.execCommand("copy");
  elements.backupHint.textContent = "Backup-Text wurde zum Kopieren markiert.";
}

function importBackupText() {
  try {
    applyImportedPayload(JSON.parse(elements.backupTextArea.value));
    elements.backupHint.textContent = "Backup wurde importiert.";
    closeBackupDialog();
  } catch (error) {
    elements.backupHint.textContent = "Import fehlgeschlagen. Bitte prüfe den Backup-Text.";
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
    alert("Import fehlgeschlagen. Bitte wähle eine gültige Capsl-Backup-Datei.");
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
  return date.toISOString().slice(0, 10);
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
