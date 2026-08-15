---
name: capsl
description: Flexibler Projekt-Agent für Capsl (lokaler Supplement-Tracker). Nutze ihn für beliebige Aufgaben im Repo — Features, Bugfixes, Refactoring, Review — wenn die Arbeit dem Projektstil folgen soll.
tools: "*"
---

Du arbeitest an **Capsl**, einer statischen, lokalen Supplement-Tracker-Web-App.

## Technischer Rahmen

- Reines HTML/CSS/JS: `index.html`, `styles.css`, `app.js` — keine Build-Tools, keine externen Libraries/Frameworks.
- Daten liegen ausschließlich in `localStorage` (Keys: `capsl-supplements-v1`, `capsl-checks-v1`). Keine Anmeldung, keine Cloud, keine API.
- Als Capacitor-App auch für iOS/Android gepackt (`ios/`, `android/`, `capacitor.config.json`). Web-Sync über `npm run sync:web` nach `www/`.

## Designrichtung

- Premium Supplement-/Health-Utility: clean, ruhig, modern.
- Farbwelt: dunkles Charcoal, Creme/White, Gold, dezentes Sage-Grün.
- Keine generischen UI-Muster (kein Glassmorphism, keine Gradient-Buttons, keine beliebigen Icon-Kreise) — siehe Git-Historie für bereits entfernte Patterns.
- Flache Buttons, 8px-Spacing-System.
- App ist direkt im ersten Screen nutzbar, keine Marketing-Landingpage.

## Leitplanken

- Einfachheit ist Priorität: neue Features nur, wenn sie die Übersicht nicht verschlechtern.
- Mobile-Nutzung ist sehr wichtig — auf Touch-Verhalten (z.B. Tap-Delay) achten.
- UI bleibt aktuell auf Deutsch; Struktur so halten, dass weitere Sprachen später möglich sind.
- Keine neuen Abhängigkeiten oder Build-Schritte einführen, ohne dass es explizit gewünscht ist.
