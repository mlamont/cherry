# Why

- making a frontend, so people can interact with a ready backend (deployed contract to testnet)
- making it minimally, so this POC doesn't involve learning much new tech

# How

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
- flattening into one file: index.html
  - adjust `comments` tags to:
    - exclude `script` tags that points to bcn-index.js, and
    - include `script` tags that explicitly houses the JS
    - ...then switch include/exclude when going to 'dev mode' from 'publish mode'
  - when including the explicitly housed JS...
    - of `bcn-index.js`: remove the one line that points to `bcn-constants.js`
    - and of `bcn-constants.js`:
      - `contractAddress` is the proxy (PPP)
      - `abi` is from `/artifacts/contracts/PeachVnn.json`, which is in a JSON format, but just paste it into this JS file and VS Code will pretty it up!
- version controlling the main page: index.html
  - update the version number in the last line of webpage text
  - save a copy of the page per template: `bcn4ipfsnnnnnnx.html`
- uploading to IPFS
  - go to Pinata: https://app.pinata.cloud/ipfs/files
  - sign in with GitHub
  - Add > File Upload (advanced settings: ensure it's V1)
  - test: https://ipfs.io/ipfs/[CID]
- connect to ENS
  - get CID from IPFS
  - go to ENS: https://app.ens.domains/color.rockopera.eth
  - Edit Profile button > Content Hash (IPFS) field > [enter CID], save

# Backlog

- make buttons visible ✅
- update constants ✅
- make 1 button work: convert integer to colorhex
  - show result in JS console (enough for PoC) ✅
  - show result on webpage ✅
