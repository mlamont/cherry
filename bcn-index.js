import {
  createWalletClient,
  custom,
  createPublicClient,
  defineChain,
  http,
} from "https://esm.sh/viem";
import { sepolia } from "https://esm.sh/viem/chains";
import { contractAddress, abi } from "./bcn-constants.js";

// grab website elements
const greetingSpan = document.getElementById("greetingSpan");
const connectButton = document.getElementById("connectButton");
const colorInput = document.getElementById("colorInput");
const namedButton = document.getElementById("namedButton");
const currentNameSpan = document.getElementById("currentNameSpan");
const currentOwnerSpan = document.getElementById("currentOwnerSpan");
const renameInput = document.getElementById("renameInput");
const renameItButton = document.getElementById("renameItButton");
const nameInput = document.getElementById("nameInput");
const nameItButton = document.getElementById("nameItButton");
const ownerIsNobodyDiv = document.getElementById("ownerIsNobodyDiv");
const ownerIsSomebodyDiv = document.getElementById("ownerIsSomebodyDiv");
const ownerIsNotMeDiv = document.getElementById("ownerIsNotMeDiv");
const ownerIsMeDiv = document.getElementById("ownerIsMeDiv");

// initialize viem pieces
let walletClient;
let publicClient;

let tokenName;
let tokenOwner;
let connectedAccount;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      chain: sepolia,
      transport: custom(window.ethereum),
    });
    console.log("wallet client created from connect() in bcn-index.js");
    [connectedAccount] = await walletClient.requestAddresses();
    greetingSpan.innerHTML = `Hello, ${connectedAccount}!`;
    connectButton.innerHTML = "(connected)";
  } else {
    connectButton.innerHTML = "(please install Metamask)";
  }
}

async function named() {
  if (typeof window.ethereum !== "undefined") {
    publicClient = createPublicClient({
      chain: sepolia,
      transport: http(),
    });
    console.log("public client created from named() in bcn-index.js");
    try {
      tokenName = await publicClient.readContract({
        address: contractAddress,
        abi: abi,
        functionName: "getName",
        args: [colorInput.value],
      });
      tokenOwner = await publicClient.readContract({
        address: contractAddress,
        abi: abi,
        functionName: "getOwner",
        args: [colorInput.value],
      });
      // ...if we made it this far, inputs were valid, and token exists...
      currentNameSpan.innerHTML = tokenName;
      currentOwnerSpan.innerHTML = tokenOwner;

      if (typeof connectedAccount !== "undefined") {
        // ...user connected... (but could've changed account since)
        // so get current connected account
        [connectedAccount] = await walletClient.requestAddresses();
        if (connectedAccount == tokenOwner) {
          // ...user is owner...
          ownerIsNobodyDiv.hidden = true;
          ownerIsSomebodyDiv.hidden = true;
          ownerIsNotMeDiv.hidden = true;
          ownerIsMeDiv.hidden = false; // owner exists, and is user
          renameInput.innerHTML = "";
        } else {
          // ...user is not owner...
          ownerIsNobodyDiv.hidden = true;
          ownerIsSomebodyDiv.hidden = true;
          ownerIsNotMeDiv.hidden = false; // owner exists, and is not user
          ownerIsMeDiv.hidden = true;
        }
      } else {
        // ...user did not connect...
        ownerIsNobodyDiv.hidden = true;
        ownerIsSomebodyDiv.hidden = false; // owner exists, could be user
        ownerIsNotMeDiv.hidden = true;
        ownerIsMeDiv.hidden = true;
      }
    } catch (error) {
      // ...some kind of error happened from querying a token's owner and/or name...
      console.log(error.message);
      if (error.message.includes("ERC721NonexistentToken")) {
        // ...ah, right, token doesn't exist...
        currentNameSpan.innerHTML = "Up for grabs!";
        currentOwnerSpan.innerHTML = "Could be you!";
        ownerIsNobodyDiv.hidden = false; // owner does not exist
        ownerIsSomebodyDiv.hidden = true;
        ownerIsNotMeDiv.hidden = true;
        ownerIsMeDiv.hidden = true;
        nameInput.innerHTML = "";
      } else {
        // ...uh, well, some other error...
        currentNameSpan.innerHTML = "please try...";
        currentOwnerSpan.innerHTML = "...that again";
        ownerIsNobodyDiv.hidden = true; // hide...
        ownerIsSomebodyDiv.hidden = true; // ...all...
        ownerIsNotMeDiv.hidden = true; // ...the...
        ownerIsMeDiv.hidden = true; // ...options
      }
    }
  } else {
    currentNameSpan.innerHTML = "please first...";
    currentOwnerSpan.innerHTML = "...install Metamask";
    ownerIsNobodyDiv.hidden = true;
    ownerIsSomebodyDiv.hidden = true;
    ownerIsNotMeDiv.hidden = true;
    ownerIsMeDiv.hidden = true;
  }
}

async function renameIt() {
  // first: connect! (gets the current connected account)
  connect();
  // now:
  try {
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });
    const { request } = await publicClient.simulateContract({
      address: contractAddress,
      abi: abi,
      functionName: "modName",
      account: connectedAccount,
      chain: sepolia,
      args: [colorInput.value, renameInput.value],
    });
    const hash = await walletClient.writeContract(request);
    console.log(hash);
  } catch (error) {
    console.log(error);
  }
}

async function nameIt() {
  // first: connect! (gets the current connected account)
  connect();
  // now:
  try {
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });
    const { request } = await publicClient.simulateContract({
      address: contractAddress,
      abi: abi,
      functionName: "setToken",
      account: connectedAccount,
      chain: sepolia,
      args: [colorInput.value, nameInput.value],
    });
    const hash = await walletClient.writeContract(request);
    console.log(hash);
  } catch (error) {
    console.log(error);
  }
}

connectButton.onclick = connect;
namedButton.onclick = named;
renameItButton.onclick = renameIt;
nameItButton.onclick = nameIt;
