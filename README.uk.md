[ [English](README.md) | **Українська** | [Italiano](README.it.md) ]

# Solar Designer Pro

Десктопний застосунок для проєктування фотоелектричних (PV) установок
відповідно до італійських електротехнічних норм (CEI 0-21, CEI 64-8,
CEI EN 62548, DCPREV-14030, CEI UNEL 35024). Single-Electron-оболонка
над vanilla-JS / Canvas / SVG ренедером, призначена для проєктувальників
та кваліфікованих монтажників, яким потрібно випустити проєктну
документацію, однолінійні схеми та документи для GSE/GAUDÌ із одного
інструмента, офлайн.

Інтерфейс — італійською навмисно: термінологія, посилання на норми та
одиниці виміру відповідають конвенціям італійських PV-проєктувальників.

## Ключові можливості

- **Імпорт планіметрії** — PNG або PDF як підкладка, калібрування за
  відомою відстанню для прив'язки до реального масштабу.
- **Малювання зон** — полігони встановлення / виключення на canvas;
  технічні перешкоди (каміни, антени, HVAC, лю́карні, витяжки) з
  буферами пожежної безпеки за DCPREV-14030.
- **Автоматичне розташування панелей** — алгоритм scanline з пошуком
  орієнтації, опціями walkway та групування, декомпозицією ввігнутих
  полігонів.
- **Бібліотека модулів** — 15 пресетів з datasheet (JA Solar, LONGi,
  Canadian Solar, Jinko, Risen, Generico) плюс редаговані користувачем.
- **Бібліотека інверторів** — SAJ R5 (моно), AT3 (трифазні), C6
  (промислові); кількість паралельних стрінгів на MPPT із datasheet.
- **Валідація стрінгів із термокорекцією** — Voc при −10 °C і Vmpp при
  +70 °C проти лімітів інвертора (CEI EN 62548 §7).
- **Розрахунок перерізу кабелів** — DC стрінг, DC магістраль, AC за
  падінням напруги та портатою (CEI UNEL 35024 Method B/C), з
  коефіцієнтами зниження за способом прокладки та групуванням.
- **Однолінійна схема (SLD, schema unifilare)** — генерація SVG із
  перемиканням BT/MT, картіньо (штамп), списком ревізій,
  опціональною топологією BESS.
- **Експорт** — SVG і PNG високої роздільної здатності для SLD;
  PDF-звіт із картіньо; CSV для подання у GSE/GAUDÌ.
- **Формат файлу проєкту `.sdproj`** — версіонований JSON з блоками
  `version`, `metadata`, `project`; діалоги Open/Save і
  localStorage-автозбереження як recovery snapshot.
- **Логування збоїв** — необроблені помилки renderer'а пишуться у
  `<userData>/logs/app.log` з обмеженою ротацією (1 MB × 5 файлів).

## Огляд робочого процесу

1. **S1** — завантаження планіметрії (PNG або PDF).
2. **S2** — калібрування масштабу за двома точками.
3. **S3** — вибір або визначення PV-модуля.
4. **S4** — малювання зон встановлення та виключення.
5. **S5** — розміщення технічних перешкод із буферами безпеки.
6. **S6** — запуск розкладки панелей; перегляд результатів по зонах.
7. **S7** — конфігурація інверторів і стрінгів.
8. **S8** — розрахунок DC і AC кабелів.
9. **S9** — генерація однолінійної схеми; експорт документації
   (SVG / PNG / PDF / GSE CSV).

## Технологічний стек

- **Electron 31** з `contextIsolation: true` та невеликим preload-bridge
  для IPC-логування збоїв.
- **Vanilla JavaScript** у strict mode, склеюється невеликим Node
  concat-скриптом у `dist/app.js` (ES-модулі / TypeScript ще не — це
  на дорожній карті Phase 3).
- **HTML5 Canvas** для редагування планіметрії; **SVG** для SLD.
- **PDF.js 3.11.174** (vendored, offline-first) для імпорту PDF.
- **electron-builder** для Windows NSIS-інсталятора.
- **ESLint 10** flat config; strict-mode у всіх файлах.
- **Vitest 4** для golden-тестів формул розрахунку кабелів.
- **GitHub Actions** CI: lint, test, electron-builder `--dir` dry-run,
  завантаження артефактів.

## Структура репозиторію

```
main.js                       Electron main process
preload.js                    contextBridge IPC для логування збоїв
solar-designer-v89.html       Один renderer-entry — DOM + UI shell
build/bundle.js               Renderer-бандлер (concat → dist/app.js)
dist/app.js                   Згенерований renderer-bundle
data/                         Вбудовані пресети модулів / інверторів
js/                           Renderer source
  config.js, state.js         Константи та глобальний стан
  storage.js                  .sdproj save/open, recovery, readers
  canvas.js, panels.js        Геометрія, рендеринг, розкладка панелей
  strings.js                  Конфігурація стрінгів і валідація
  pdf.js                      Імпорт PDF-планіметрії
  export.js                   Експорт PDF / JSON / SVG / PNG
  enhancements.js             Статус-бар, мінімапа, скорочення
  ui.js                       init(), event handlers, віджети
  lib/sizing.js               Чисті sizing-функції (під golden-тестами)
  cables.js                   Оркестратор (calcCables, список
                              інверторів, пресети модулів)
  cables/sld-render.js        Генерація SVG однолінійної схеми
  cables/sld-export.js        SLD → SVG/PNG, GSE CSV
  cables/verifiche.js         Валідація інверторів, панель verifiche
css/                          Component stylesheets
vendor/pdfjs/                 Vendored PDF.js (offline)
assets/fonts/                 Vendored JetBrains Mono шрифти
docs/                         Reference docs, схеми, lint baseline
schema unifilare/             Italian-language SLD design specs
schemas/sdproj.v1.json        Схема .sdproj (інформативна)
tests/                        Vitest golden-тести + fixtures
.github/workflows/ci.yml      Lint / test / build dry-run pipeline
```

Інженерний контракт (читати перед будь-якою зміною коду):

- [`INVARIANTS.md`](INVARIANTS.md) — фізичні / workflow / output / data
  інваріанти.
- [`COMPLIANCE.md`](COMPLIANCE.md) — пінінг редакцій норм CEI / EN /
  UNEL і map "formula → article".
- [`CRITICAL_FLOWS.md`](CRITICAL_FLOWS.md) — manual smoke checklist.
- [`DO_NOT_TOUCH_PAIRS.md`](DO_NOT_TOUCH_PAIRS.md) — файли, які
  мусять змінюватися разом.

## Початок роботи

Вимоги:

- Node.js LTS (≥ 20)
- npm 10+

```sh
git clone https://github.com/Zojniq/SunPanelPO.git
cd SunPanelPO
npm install
```

## Команди build / run

| Команда | Призначення |
|---|---|
| `npm start` | Зібрати renderer-bundle і запустити застосунок (dev) |
| `npm run build:bundle` | Лише перегенерувати `dist/app.js` |
| `npm test` | Запустити vitest golden-тести розрахунку кабелів |
| `npm run lint` | Запустити ESLint (має бути 0 помилок) |
| `npm run dist` | Зібрати Windows NSIS-інсталятор |

`npm start` і `npm run dist` автоматично перебудовують bundle перед
запуском.

## Поточний статус проєкту

Проєкт у середині еволюції за багатофазним планом професіоналізації.
**Phase 3 — Architecture restructuring триває.**

| Фаза | Статус |
|---|---|
| 0 — Guardrails | завершена |
| 1 — Immediate professional fixes | завершена |
| 2 — Engineering foundation | завершена (Gate D — ready з трекованими ризиками) |
| 3 — Architecture restructuring | триває |
| 4 — Product-grade capabilities | очікує |
| 5 — Long-term evolution | gated |

### Прогрес Phase 3

- **AP-14 — Bundler integration** ✅ Node concat-builder пише
  `dist/app.js`; HTML тепер завантажує один renderer-script.
- **AP-15 — Декомпозиція `cables.js`** ✅ Розділено на оркестратор
  (`cables.js`), `cables/sld-render.js`, `cables/sld-export.js`,
  `cables/verifiche.js`. `cables.js` скоротився з ~2350 до ~460 рядків.
- **AP-16 — Декомпозиція `ui.js`** ⏭ наступний.
- **AP-17 — State store** — очікує.
- **AP-18 — Type adoption (JSDoc → TypeScript для нового коду)** — очікує.
- **AP-19 — innerHTML sanitization** — очікує.

## Примітки / обмеження

- **Інтерфейс італійською.** Це навмисно — продукт розрахований на
  італійський PV-ринок з італійськими нормами.
- **Доменні припущення для Італії** — найхолодніша температура модуля
  −10 °C, найгарячіша +70 °C, широта ~44° N для оцінки тіней.
  Використання поза Італією робить недійсними вердикти string-вікна
  до перегляду цих припущень.
- **Інженерне рішення необхідне.** Застосунок підтримує кваліфікованого
  проєктувальника, не замінює його. Перерізи кабелів, вікна стрінгів,
  результати verifiche мають бути переглянуті проти актуальних редакцій
  CEI на момент проєкту.
- **Один проєкт на сесію.** Одночасно один активний проєкт; автозбереження
  тримає recovery snapshot у localStorage. `.sdproj` — канонічний
  формат для обміну та архівації.
- **Італійський ринок.** Посилання на норми (CEI 0-21, CEI 64-8,
  CEI EN 62548, DCPREV-14030, CEI UNEL 35024) орієнтовані на Італію;
  експорт GSE/GAUDÌ — формат подання до італійського TSO.

## Ліцензія

Proprietary. Vendored сторонні asset'и зберігають свої оригінальні
ліцензії:

- `vendor/pdfjs/LICENSE` — Apache 2.0 (Mozilla pdf.js).
- `assets/fonts/OFL.txt` — SIL Open Font License 1.1 (JetBrains Mono).
