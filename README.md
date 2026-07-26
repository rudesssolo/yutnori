# 윷놀이 Yutnori

Gioco tradizionale coreano in un singolo file HTML — zero dipendenze, offline-ready.

[🇬🇧 English version below ↑](#english)

## Caratteristiche

- **Tabellone 29 caselle** con percorso antiorario, scorciatoie diagonali (angoli, centro)
- **4 bastoncini virtuali**: 도 Do(1), 개 Gae(2), 걸 Geol(3), 윷 Yut(4+rilancio), 모 Mo(5+rilancio), **빽도 Back-do** (attivabile)
- **Probabilità realistica**: la faccia piatta esce nel 55% dei casi, come nei bastoncini veri mezzi tondi (non un 50/50 astratto)
- **Cattura, raggruppamento**, rilancio dopo cattura/Yut/Mo
- **2 modalità**: giocatore locale / contro CPU con difficoltà Facile, Normale e Difficile
- **Chi inizia**: rosso, blu, oppure sorteggio con i bastoncini sul tabellone (chi fa più alto comincia, parità → si ripete)
- **Zone di riserva**: le pedine non ancora entrate stanno in quattro slot laterali, così la casella finale resta leggibile
- **Grafico dell'andamento**: a fine partita, barre divergenti turno per turno che mostrano chi era in vantaggio, con marcatori per catture e uscite
- **Statistiche finali**: tiri, media, Yut/Mo, back-do, mosse, passi, bivi, catture e raggruppamenti per giocatore
- **4 lingue**: Italiano · English · 한국어 · 中文
- **Grafica moderna**: tema scuro, glassmorphism, animazioni (lancio 3D, ingresso e rientro delle pedine, particelle catture, confetti vittoria)
- **Temi del tabellone**: Modern e Traditional, selezionabili e memorizzati localmente
- **Effetti sonori sintetizzati** (Web Audio API, disattivabili)
- **Responsive** — desktop e mobile con dock fisso in basso
- **Accessibilità**: rispetta `prefers-reduced-motion`, grafico con etichetta descrittiva
- Singolo file HTML (~78KB), niente server, niente npm, niente installazione

## Come giocare

1. Apri `index.html` in un browser
2. Scegli modalità (2 giocatori / CPU), chi inizia, tema e lingua
3. Lancia i bastoncini 🎲 e muovi le pedine
4. Porta tutte e 4 le tue pedine fuori dal tabellone per vincere

## Regole rapide

| Lancio | Nome | Passi | Rilancio | Probabilità |
|---|---|---|---|---|
| 1 faccia piatta | 도 Do | 1 | — | 15,0% |
| 2 facce piatte | 개 Gae | 2 | — | 36,8% |
| 3 facce piatte | 걸 Geol | 3 | — | 29,9% |
| 4 facce piatte | 윷 Yut | 4 | ✓ | 9,2% |
| 0 facce piatte (tutte curve) | 모 Mo | 5 | ✓ | 4,1% |
| Solo il bastoncino segnato piatto | 빽도 Back-do | −1 | — | 5,0% |

Con la regola Back-do disattivata quel 5% si somma a 도 Do (20,0%). Valore medio del tiro: 2,30.

- Le pedine **partono dalle zone di riserva** ai lati del tabellone ed entrano in gioco dalla prima casella dopo 출발
- **Traguardo**: arrivare sull'ultima casella (출발) non basta; serve un ulteriore passo per uscire dal circuito
- **Giro obbligatorio**: una pedina può uscire solo dopo aver percorso l'intero circuito. Un back-do che la riporta sulla casella finale non le permette di fare punto: dovrà rifare il giro
- **Scorciatoie**: fermandoti esattamente su angolo NE (5) / NO (10) / centro (22) puoi scegliere tra diagonale e percorso esterno
- **Back-do al centro**: puoi scegliere quale delle due diagonali ripercorrere
- **Cattura** → la pedina avversaria torna nella sua zona di riserva + rilancio
- **Raggruppamento (업기)** → pedine proprie sulla stessa casella viaggiano insieme

---

<span id="english"></span>

# 윷놀이 Yutnori

Traditional Korean board game in a single HTML file — zero dependencies, offline-ready.

## Features

- **29-space board** with counter-clockwise path, diagonal shortcuts (corners, center)
- **4 virtual sticks**: Do(1), Gae(2), Geol(3), Yut(4+rethrow), Mo(5+rethrow), **Back-do** (toggle)
- **Realistic odds**: the flat face lands up 55% of the time, like real half-round yut sticks (not an abstract 50/50)
- **Capture, stacking (업기)**, extra throw after capture / Yut / Mo
- **2 modes**: local multiplayer / vs CPU with Easy, Normal and Hard difficulty
- **Who starts**: red, blue, or a roll-off thrown on the board (highest throw starts, ties are re-thrown)
- **Reserve areas**: pieces that have not entered yet sit in four side slots, keeping the final square readable
- **Momentum chart**: after the match, diverging bars per turn showing which player held the advantage, with markers for captures and pieces sent out
- **End-of-match statistics**: throws, averages, Yut/Mo, back-do, moves, steps, branches, captures and stacks per player
- **4 languages**: English · Italiano · 한국어 · 中文
- **Modern UI**: dark theme, glassmorphism, animations (3D stick toss, pieces entering and returning to the reserve, capture particles, win confetti)
- **Board themes**: Modern and Traditional, selectable and saved locally
- **Synthesized sound effects** (Web Audio API, toggle off)
- **Responsive** — desktop & mobile with fixed bottom dock
- **Accessibility**: honours `prefers-reduced-motion`, chart carries a descriptive label
- Single HTML file (~78KB), no server, no npm, no setup

## How to play

1. Open `index.html` in a browser
2. Choose mode (2 players / CPU), who starts, theme and language
3. Throw the sticks 🎲 and move your pieces
4. Get all 4 pieces out of the board to win

## Quick rules

| Throw | Name | Steps | Extra throw | Probability |
|---|---|---|---|---|
| 1 flat face up | 도 Do | 1 | — | 15.0% |
| 2 flat faces up | 개 Gae | 2 | — | 36.8% |
| 3 flat faces up | 걸 Geol | 3 | — | 29.9% |
| 4 flat faces up | 윷 Yut | 4 | ✓ | 9.2% |
| 0 flat faces up (all round) | 모 Mo | 5 | ✓ | 4.1% |
| Only the marked stick flat up | 빽도 Back-do | −1 | — | 5.0% |

With the Back-do rule off, that 5% folds into 도 Do (20.0%). Mean throw value: 2.30.

- Pieces **start in the reserve areas** on either side of the board and enter play on the first square after 출발
- **Finish**: reaching the final square (출발) is not enough; one further step is required to leave the course
- **Full lap required**: a piece may only leave once it has travelled the whole circuit. A back-do that puts it back on the final square does not let it score — it has to go around again
- **Shortcuts**: land exactly on NE corner(5) / NW corner(10) / center(22) and choose the diagonal or outer path
- **Back-do at the center**: choose which of the two diagonals to move back along
- **Capture** → the opponent's piece returns to its reserve area + extra throw
- **Stacking (업기)** → own pieces on the same square travel together

---

## Credits

[Wikipedia — Yunnori](https://en.wikipedia.org/wiki/Yunnori) · Game design: traditional Korean folk game · Implementation: single-file HTML/CSS/JS
