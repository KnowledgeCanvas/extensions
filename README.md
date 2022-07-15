# Knowledge Extensions

Chrome extension for the [Knowledge](https://github.com/KnowledgeCanvas/knowledge) application (Firefox extension coming soon!).


- [Features](#features)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)

# Features

Knowledge Extensions are meant to augment the use of the Knowledge application by making it easier to import sources without leaving the browser. Extensions automatically extract content from the active tab and allows user customization before sending that data to the Knowledge application.

## Feature Roadmap

- [ ] Automatic Extraction
  - [x] Basic extraction (title, url, icon)
  - [x] Topic (keywords) extraction
  - [x] [OpenGraph](https://ogp.me/) extraction (description, thumbnail, type, etc.)
  - [x] Highlighted text extraction
  - [ ] Article extraction
  - [ ] Code blocks extraction
- [x] `Important` flag
- [ ] Sync with `Knowledge` for existing sources
  - [ ] Show source details in extension if it exists in `Knowledge`
  - [ ] Show related/similar sources
  - [ ] Persist highlights and other markup
- [ ] Save as PDF on Import

# Screenshots
<img width="1284" alt="image" src="https://user-images.githubusercontent.com/19367848/179290906-458d374a-ce6d-482c-9dea-bcb5b6463c5a.png">

<img width="1284" alt="image" src="https://user-images.githubusercontent.com/19367848/179290995-4829401f-78bc-4279-9e79-395126c66613.png">

<img width="1175" alt="image" src="https://user-images.githubusercontent.com/19367848/179291568-ae6bf977-63f5-453b-88a5-d978d03df982.png">



# Getting Started

**Note:** Extensions only works with `Knowledge` version 0.6.0 or higher. `Knowledge` must be opened and `Browser Extensions` must be enabled in the `Import Settings` menu. Extensions are side-loaded using developer mode in Chrome for now. We are still investigating the viability of hosting the extension on the Chrome Web Store.

## Instructions
1. Download the prebuilt zip, or build from source (see below)
2. Ensure that `Knowledge` version 0.6.0 or higher is installed
3. Enable "Browser Extensions" in the `Import Settings` menu in `Knowledge`
4. In Chrome, navigate to `chrome://extensions`
5. Enable "Developer mode"
6. Click `Load unpacked`
7. Select the `knowledge-extensions` folder
  - When building from source, this will be under `<root>/dist/knowledge-extensions`
8. (Optional): Click the Chrome Extensions button and pin `Knowledge Extension` for quick access


<img width="1278" alt="image" src="https://user-images.githubusercontent.com/19367848/179286999-10bc8da1-844e-4821-8e50-b2184ffeae49.png">
