# Keyforge Deck Tracker

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.1.

Webapp to be used alongside the cardgame Keyforge (https://www.keyforgegame.com/).

Working example at https://keyforge-2eb07.web.app/

## Features:

1. Create custom tournaments with either round robin, swiss style or single elimination rules.
    a. Round robin ensures that each player faces each other player exactly once
    b. Swiss style uses win/loss, followed by strength of schedule, followed by extended strength of schedule to determine rankings and pairings as described by the Keyforge tournament rules (see below)
    c. Single elimination can either start with randomized pairings or seeded positions
2. Tracks decks unofficial wins/losses as well as unofficial chains as described by the Keyforge tournament rules (see below)

Keyforge Tournament Rules:  https://images-cdn.fantasyflightgames.com/filer_public/bf/4d/bf4db20f-92b7-4bdb-b1af-ba1dcb2fd435/kf_tournament_regulations-compressed.pdf

## How to use:

Make sure you are using the latest version of angular CLI
Run "npm install" inside this project folder to install all dependencies.
Run "ng serve --open" to start the dev server and automaticall open in browser
