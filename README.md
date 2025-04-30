# BAXATHON Showcase

[![BOB Avatar](https://raw.githubusercontent.com/LoreviQ/Baxus-Honey-Barrel/main/assets/bob.png)](https://baxathon.oliver.tj)

Welcome to the frontend showcase for my BAXATHON submissions! While this web interface wasn't a required deliverable, it serves as a central hub and live demonstration platform for the three distinct projects developed for the hackathon.

**Check out the live site:** [**baxathon.oliver.tj**](https://baxathon.oliver.tj)

This site integrates and presents the functionalities of the Whiskey Goggles, BOB AI Agent, and Honey Barrel Chrome Extension projects.

---

## The Hackathon Tracks & Projects

Here's a breakdown of the individual submissions showcased on this site:

### 1. Whiskey Goggles 🥃👓

- **Goal:** Develop a computer vision system to identify whisky bottle labels from photos and match them against the BAXUS database.
- **My Solution:** A system combining a custom-trained EfficientNet image classification model (~85% accuracy) and Tesseract OCR for robust identification. BOB, our AI butler, "wears" the goggles to perform the analysis.
- **Live Demo:** [**Try Whiskey Goggles**](https://baxathon.oliver.tj/whiskeygoggles)
- **GitHub Repo:** [**LoreviQ/Baxus-Whisky-Goggles**](https://github.com/LoreviQ/Baxus-Whisky-Goggles)

### 2. BOB (BAXUS Outstanding Butler) 🤖

- **Goal:** Create an AI agent ("Bob") to analyze a user's virtual bar, understand their preferences, and provide personalized bottle recommendations from the BAXUS dataset.
- **My Solution:** BOB is an AI whiskey expert built with a custom agent framework (`@olivertj/agent-builder`). He analyzes user collections (via the BAXUS API), provides reasoned recommendations, and maintains a distinct "Outstanding Butler" persona with a unique tone.
- **Live Demo:** [**Chat with BOB**](https://baxathon.oliver.tj/bob)
- **GitHub Repo:** [**LoreviQ/Baxus-Bob**](https://github.com/LoreviQ/Baxus-Bob)

### 3. Honey Barrel 🍯

- **Goal:** Build a Chrome extension to scrape bottle info from retail sites and cross-reference with the BAXUS marketplace for better prices.
- **My Solution:** A Chrome extension that automatically scans supported sites (e.g., The Whisky Exchange, Flask Fine Wines). If a better price is found on BAXUS, BOB alerts the user with savings details and a direct link. It also integrates the Whiskey Goggles feature for image-based identification on any webpage.
- **Learn More & Download:** [**Honey Barrel Info**](https://baxathon.oliver.tj/honeybarrel)
- **GitHub Repo:** [**LoreviQ/Baxus-Honey-Barrel**](https://github.com/LoreviQ/Baxus-Honey-Barrel)

---

## Integration Highlights ✨

This frontend project emphasizes the synergy between the individual submissions:

- **BOB's Persona:** BOB isn't just an API; he's a character! His "Outstanding Butler" persona, unique AI-generated avatar (including variations like him wearing the Whiskey Goggles), and distinct conversational style are showcased in the chat interface.
- **Whiskey Goggles in Action:** You can directly use the Whiskey Goggles feature via this website, interacting with the backend service. BOB is presented as the agent performing the visual identification.
- **Cross-Project Functionality:** The Honey Barrel extension incorporates both BOB (for delivering alerts) and the Whiskey Goggles (for identifying bottles from images found while browsing). This frontend provides information and download links for the extension.
- **Live Demonstrations:** This site acts as a live, interactive demo for both the BOB chat functionality and the Whiskey Goggles image recognition.

---

## Frontend Technology Stack

This showcase website is built using modern web technologies:

- **Framework:** React
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Docker & Google Cloud Run (via `scripts/deploy.sh`)

---

_Disclaimer: This frontend application was created as a supplementary demonstration for the BAXATHON hackathon and was not part of the official deliverables for any specific track._
