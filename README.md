# 윷놀이 Yutnori

Gioco tradizionale coreano in un singolo file HTML — zero dipendenze, offline-ready.

[🇬🇧 English version below ↑](#english)

## Caratteristiche

- **Tabellone 29 caselle** con percorso antiorario, scorciatoie diagonali (angoli, centro)
- **4 bastoncini virtuali**: 도 Do(1), 개 Gae(2), 걸 Geol(3), 윷 Yut(4+rilancio), 모 Mo(5+rilancio), **빽도 Back-do** (attivabile)
- **Cattura, raggruppamento**, rilancio dopo cattura/Yut/Mo
- **2 modalità**: giocatore locale / contro CPU (euristica intelligente)
- **4 lingue**: Italiano · English · 한국어 · 中文
- **Grafica moderna**: tema scuro, glassmorphism, animazioni (lancio 3D, particelle catture, confetti vittoria)
- **Effetti sonori sintetizzati** (Web Audio API, disattivabili)
- **Responsive** — desktop e mobile con dock fisso in basso
- Singolo file HTML (~36KB), niente server, niente npm, niente installazione

## Come giocare

1. Apri `index.html` in un browser
2. Scegli modalità (2 giocatori / CPU) e lingua
3. Lancia i bastoncini 🎲 e muovi le pedine
4. Porta tutte e 4 le tue pedine fuori dal tabellone per vincere

## Regole rapide

| Lancio        | Nome | Passi | Rilancio |
|---------------|------|-------|----------|
| 3 piatti      | 도   | 1     | —        |
| 2 piatti      | 개   | 2     | —        |
| 1 piatto      | 걸   | 3     | —        |
| 0 piatti      | 윷   | 4     | ✓        |
| 4 piatti      | 모   | 5     | ✓        |
| Solo bastoncino segnato↓ | 빽도 | -1 | — |

- Le pedine **partono dalla casella 출발**
- **Scorciatoie**: fermandoti esattamente su angolo NE (5) / NO (10) / centro (22) → diagonale
- **Cattura** → pedina avversaria torna a casa + rilancio
- **Raggruppamento (업기)** → pedine proprie sulla stessa casella viaggiano insieme

---

<span id="english"></span>

# 윷놀이 Yutnori

Traditional Korean board game in a single HTML file — zero dependencies, offline-ready.

## Features

- **29-space board** with counter-clockwise path, diagonal shortcuts (corners, center)
- **4 virtual sticks**: Do(1), Gae(2), Geol(3), Yut(4+rethrow), Mo(5+rethrow), **Back-do** (toggle)
- **Capture, stacking (업기)**, extra throw after capture / Yut / Mo
- **2 modes**: local multiplayer / vs CPU (smart heuristic)
- **4 languages**: English · Italiano · 한국어 · 中文
- **Modern UI**: dark theme, glassmorphism, animations (3D stick toss, capture particles, win confetti)
- **Synthesized sound effects** (Web Audio API, toggle off)
- **Responsive** — desktop & mobile with fixed bottom dock
- Single HTML file (~36KB), no server, no npm, no setup

## How to play

1. Open `index.html` in a browser
2. Choose mode (2 players / CPU) and language
3. Throw the sticks 🎲 and move your pieces
4. Get all 4 pieces out of the board to win

## Quick rules

| Throw          | Name | Steps | Extra throw |
|----------------|------|-------|-------------|
| 3 flat (up)    | 도   | 1     | —           |
| 2 flat         | 개   | 2     | —           |
| 1 flat         | 걸   | 3     | —           |
| 0 flat         | 윷   | 4     | ✓           |
| 4 flat         | 모   | 5     | ✓           |
| Only marked↓   | 빽도 | -1    | —           |

- Pieces **start from the 출발 square**
- **Shortcuts**: land exactly on NE corner(5) / NW corner(10) / center(22) → diagonal path
- **Capture** → opponent's piece goes home + extra throw
- **Stacking (업기)** → own pieces on the same square travel together

---

## Credits

[Wikipedia — Yunnori](https://en.wikipedia.org/wiki/Yunnori) · Game design: traditional Korean folk game · Implementation: single-file HTML/CSS/JS
