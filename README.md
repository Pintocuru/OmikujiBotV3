English | [日本語](README.ja.md)

# OmikujiBot

OmikujiBot is a project for building an omikuji (fortune-drawing) bot dedicated to the streaming app "OneComme".
It consists of the "Generator", which runs the bot, and the "Editor", which edits its data.

## Overview

### Generator : the bot itself (`src/generator`)

Loads the configuration data (JSON) created in the Editor, then reacts to comments, draws omikuji, runs games, and displays effects.

### Editor : the configuration editor (`src/editor`)

An editor for creating and editing the Generator's configuration data.
Omikuji results, probabilities, effects, reactions to comments, and more can be set through a GUI.

### Games : game scripts (`src/games`)

Game scripts executed by the bot. They can handle complex logic and run when a trigger fires.

### UI : on-screen UI for streams (`src/ui`)

UI components displayed on the stream screen (such as CommentBubble).

### Manager : data manager (`src/manager`)

Centrally manages the data used by the Editor.
Available once the editor plugin is installed.

### Plugin : editor plugin (`src/plugin`)

An OneComme plugin dedicated to OmikujiBot.
Required to use the data manager.
It can also save game results (such as rankings for Suika Generator).

### Packages : distribution packages (`packages`)

Products for distribution. Each package selects its UI and layout in `main.ts` and is built with webpack.
The free edition ships the Generator only; the paid edition ships both the Generator and the Editor.

## Directory Structure

| Directory   | Description                                                   |
| ----------- | ------------------------------------------------------------- |
| `src/`      | All source code                                               |
| `packages/` | Distribution packages (grouped by release period)             |
| `tools/`    | Development tools such as build and JSON merge                |
| `docs/`     | Manuals (README) for each product                             |
| `assets/`   | Character images, sounds, and other image assets              |
| `server/`   | Development server (Express) and the editor plugin            |
| `build/`    | Legacy build folder (migrating to `packages/`, to be removed) |

### Inside `src`

| Directory    | Description                                                       |
| ------------ | ----------------------------------------------------------------- |
| `generator/` | The bot itself (stores, event processing, trigger checks)         |
| `editor/`    | The editor itself                                                 |
| `engine/`    | Core logic: omikuji drawing, placeholders, posting                |
| `games/`     | Game scripts                                                      |
| `ui/`        | On-screen UI for streams (such as CommentBubble)                  |
| `layout/`    | UI layouts. Each package can have its own dedicated layout        |
| `plugin/`    | Editor plugin                                                     |
| `manager/`   | Data manager                                                      |
| `sdk/`       | Connecting to, subscribing to, and posting to OneComme            |
| `common/`    | Parts shared by the Generator and the Editor (such as migrations) |
| `maps/`      | Definition maps corresponding to the types                        |
| `i18n/`      | Internationalization (Japanese and English)                       |
| `types/`     | Type definitions                                                  |
