# BEST Design Days Web

Web stranica projekta BEST Design Days (BEST Zagreb). Običan HTML + CSS + JavaScript, bez build koraka.

## Hosting

Live at <https://designdays.best.hr/>, served by Cloudflare Workers as static files straight from this repository.
Every push to `main` is deployed by Workers Builds within a minute or two. The `dev` branch deploys the same way to <https://designdays.dev.best.hr/> for trying changes first.
`wrangler.jsonc` is the Workers config and `.assetsignore` lists files that are never served; keep both.

## Wayback Machine

The site runs at <https://designdays.best.hr/>. The Internet Archive's calendar for it is <https://web.archive.org/web/*/https://designdays.best.hr/*>.
Checked on 2026-09-11: captures run from 2022-07-23 to at least 2025-09-28, with 98 distinct URLs answering 200 but only 1 HTML page among them. A fresh capture of both pages was requested on 2026-09-11.

## Editions

The previous design, used from 2022 to 2025, is archived with the 2025 content at <https://2025.designdays.best.hr/> ([BEST-Design-Days-2025-Web](https://github.com/BEST-Zagreb/BEST-Design-Days-2025-Web)); this repository's history up to `87230cb` is how it was built.

## Prošla izdanja

`data/2022/` do `data/2025/` i slike u `img/people/` i `img/partners/project/` su podaci prošlih izdanja (predavači, partneri, organizatori).
Stranica ih ne prikazuje, čuvaju se kao arhiva. `data/godisnjiPartneri.json` je popis godišnjih partnera BEST-a Zagreb sa stare stranice.

## Pokretanje lokalno

Podaci se učitavaju iz JSON datoteka (`fetch`), pa stranicu treba otvoriti preko servera, ne dvoklikom:

```bash
python -m http.server 8000
# pa otvori http://localhost:8000
```

(ili VS Code ekstenzija _Live Server_).

## Uređivanje sadržaja

Sav sadržaj koji se mijenja iz godine u godinu je u `data/`:

| Datoteka                               | Što sadrži                                                                    |
| -------------------------------------- | ----------------------------------------------------------------------------- |
| `data/config.json`                     | **godina**, podnaslov, link na formu i otvorene/zatvorene prijave, kartice Gdje/Kada/Kako/Case study, e-mail |
| `data/<godina>/aktivnosti.json`        | raspored; iz njega se automatski slažu i **predavači**                        |
| `data/<godina>/partneri.json`          | partneri projekta (po razinama, prikazuju se redom)                           |
| `data/<godina>/organizacijskiTim.json` | organizatori                                                                  |
| `data/faqs.json`                       | često postavljana pitanja                                                     |
| `data/galerija.json`                   | slike u galeriji                                                              |

Tekstovi "Što je BDD" i "Zašto trebaš doći" su direktno u `index.html`.

### Aktivnost (raspored)

```json
{
  "datum": "12.10.2026.",
  "vrijeme": "16:00 - 17:00",
  "tema": "Naslov predavanja",
  "tvrtka": "",
  "lokacija": "",
  "opis": "",
  "predavaci": [{ "ime": "Ime Prezime", "imgUrl": "./img/people/lecturers/2026/ime.jpg" }]
}
```

- Aktivnosti s istim `datum` idu u isti dan; dani se numeriraju redom ("1. dan", "2. dan"...).
- `"dan": "Case study i zatvaranje"`: vlastiti naziv dana umjesto broja.
- Ako je upisana `lokacija` ili `opis`, red u rasporedu se može otvoriti.
- Aktivnost bez predavača (npr. otvaranje): `"predavaci": [{ "ime": "", "imgUrl": "" }]`.
- Predavač bez slike dobiva placeholder.

### Partner

```json
{ "naziv": "Macan", "imgUrl": "./img/partners/2026/macan.png", "linkUrl": "https://macan.hr/", "scale": 0.8 }
```

`scale` je neobavezan: koristi se za logotipe koji ispadnu premali/preveliki.
`bg` je neobavezan: boja kartice za bijele logotipe (npr. `"bg": "#20013c"`).

### Organizator

```json
{ "ime": "Ime Prezime", "funkcija": "Glavni organizator", "email": "ime.prezime@best-eu.org", "tel": "+385 91 000 0000", "imgUrl": "./img/people/orgs/2026/ime.jpg" }
```

## Nova godina: checklist

1. U `data/config.json` promijeni `godina`, datume u `info` i link na formu.
2. Kopiraj `data/2026/` u `data/<nova godina>/` i ispuni podatke.
3. Slike stavi u `img/people/lecturers/<godina>/`, `img/people/orgs/<godina>/`, `img/partners/<godina>/`.
4. Kad se prijave zatvore: `"otvorena": false` u `config.json`.

Savjet: slike prije uploada smanji (npr. na ~800 px za osobe, ~1600 px za galeriju).

## Struktura

```
index.html
css/style.css          svi stilovi
js/main.js             helperi, navigacija, config, info kartice, karusel
js/hero.js             interaktivni "editor" oko logotipa + lotos koji se odbija
js/raspored.js         raspored + kantica boje
js/predavaci.js, organizatori.js, partneri.js, galerija.js, faq.js
img/icons/             Lucide ikone (https://lucide.dev, ISC licenca)
                       + Simple Icons za Instagram/Facebook/LinkedIn (https://simpleicons.org, CC0)
fonts/                 Glacial Indifference (SIL OFL); č/ć/š/ž/đ se prikazuju fontom Jost
```
