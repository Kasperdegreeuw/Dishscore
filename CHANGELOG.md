# Patch notes

## v1.3 — 17 juni 2026

### Naar aanleiding van gebruikerstest
- **Chatbot valt meer op:** vast tekstwolkje ("Hulp nodig?") naast de robot.
- **Gerecht toevoegen:** het hele kaartje is nu klikbaar om toe te voegen, met een los **ⓘ-knopje** voor meer info.
- **Onboarding:** thema's zijn nu te ordenen met **op/neer-pijltjes** (naast slepen), met een korte uitleg per thema.
- **Detailpagina opnieuw ingedeeld:** radar verwijderd (staat al op het dashboard), breder hero-blok met de score en de "Gerecht toevoegen"-knop naast elkaar, en Kosten · Ingrediënten · Alternatieven als drie even hoge kaarten naast elkaar.
- **Dashboard:** reset-knop "↺ Terug naar radar" en een korte uitleg onder de thema-radar.
- **Ingrediënten:** herkomst en percentages gecorrigeerd.

## v1.2 — 16 juni 2026

### Chatbot
- De chatbot is nu een **werkende AI-assistent** in plaats van een statisch ontwerp.
- Praat met Claude (model Claude Haiku 4.5) via de officiële Anthropic-SDK, rechtstreeks vanuit de browser.
- Echte chat-ervaring: berichtgeschiedenis, eigen bubbels en bot-bubbels, een "aan het typen…"-animatie en een nette foutmelding als er iets misgaat.
- De suggestieknoppen sturen nu echt een vraag in; de assistent kent het geselecteerde gerecht.
- Nederlandstalige, beknopte antwoorden met praktische tips, afgestemd op de Dish Score-context.
- De API-key wordt uit een lokaal `.env.local`-bestand gelezen en staat in `.gitignore` (wordt niet meegecommit).

## v1.1 — 15 juni 2026

### Responsiviteit & schaling
- Alle schermen schalen nu netjes mee met de viewport, ook op 100% zoom.
- **Laadscherm** wordt verticaal gecentreerd en blijft volledig in beeld op elk schermformaat.
- **Dashboard** en **Gerecht toevoegen** krimpen automatisch mee op smallere schermen, zodat er niets meer rechts buiten beeld valt.

### Gerecht toevoegen
- De pop-up past nu altijd binnen het scherm — geen vervelende page-scroll meer.
- De titel **"Gerecht toevoegen"** blijft bovenaan staan tijdens het scrollen.
- De zijbalk **"Toegevoegd aan scenario"** heeft een vaste header; de gerechtenlijst scrolt daar netjes onderdoor, terwijl de samenvatting en knoppen onderaan blijven staan.
- Subtiele achtergrond-blur achter de pop-up voor meer focus.
- Sluitknop (×) verplaatst naar de hoek, niet meer overlappend met de inhoud.
- "Betaalbare opties" compacter zodat alles past.

### Leesbaarheid
- Veel te kleine teksten (6–10px) zijn opgehoogd naar een goed leesbare grootte (10–14px), inclusief de labels in de grafieken.

### Toegankelijkheid (WCAG AA)
- Kleurcontrasten gecontroleerd en verbeterd: zwakke groene en grijze teksten zijn donkerder gemaakt. Alle belangrijke tekst haalt nu minimaal een contrastratio van 4.5:1.

### Overige verbeteringen
- De iconen op de dashboard-kaartjes (euro, blaadje, e.d.) worden niet meer uitgerekt.
- Stat-kaart "Hoogste verschil" en de detail-pagina ("Alternatieven") lijnen weer correct uit.
- Meer ruimte onderaan het dashboard.
