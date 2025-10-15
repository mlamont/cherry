# Why

- making a frontend, so people can interact with a ready backend (deployed contract to testnet)
- making it minimally, so this POC doesn't involve learning much new tech

# How

- [Gotta figure out how I update this page, sourcing from separate files and flattining it into one, it would seem, then version controlling the main page, and THEN how I upload to IPFS.]
  - sourcing from separate files
  - flattening into one file
  - version controlling the main page
  - uploading to IPFS
- sourcing from separate files
  - index.html: the 1 file that is uploaded to IPFS
    - in 'dev mode', it points to JS:
      - in bcn-index.js,
      - which also points to bcn-constants.js
    - in 'publish mode', it houses the JS:
      - almost exactly bcn-index.js,
      - & almost exactly bcn-constants.js
  - bcn-index.js: mods HTML, pulls in constants, interacts with blockchain
  - bcn-constants.js: holds constants

# Backlog

- make buttons visible ✅
- update constants ✅
- make 1 button work: convert integer to colorhex
  - show result in JS console (enough for PoC) ✅
  - show result on webpage ✅
