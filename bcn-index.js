import {
  createWalletClient,
  custom,
  createPublicClient,
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
  // let's start with a clean UI slate
  renameInput.value = "";
  nameInput.value = "";
  ownerIsNobodyDiv.hidden = true;
  ownerIsSomebodyDiv.hidden = true;
  ownerIsNotMeDiv.hidden = true;
  ownerIsMeDiv.hidden = true;
  // ...is Metamask installed...
  if (typeof window.ethereum !== "undefined") {
    // ...Metamask is installed...
    publicClient = createPublicClient({
      chain: sepolia,
      transport: http(),
    });
    console.log("public client created from named() in bcn-index.js");
    console.log(colorInput.value.substring(1));
    // let's try to get the token's name & owner
    try {
      tokenName = await publicClient.readContract({
        address: contractAddress,
        abi: abi,
        functionName: "getName",
        args: [colorInput.value.substring(1)],
      });
      tokenOwner = await publicClient.readContract({
        address: contractAddress,
        abi: abi,
        functionName: "getOwner",
        args: [colorInput.value.substring(1)],
      });
      // ...if we made it this far, inputs were valid, and token exists...
      // let's show the token's name & owner
      currentNameSpan.innerHTML = tokenName;
      currentOwnerSpan.innerHTML = tokenOwner;
      // ...did the user connect...
      if (typeof connectedAccount !== "undefined") {
        // ...user connected... (but could've changed account since)
        // let's get the current connected account
        [connectedAccount] = await walletClient.requestAddresses();
        // ...is the user the owner...
        if (connectedAccount == tokenOwner) {
          // ...user is the owner...
          ownerIsMeDiv.hidden = false; // ...owner exists, and is user
        } else {
          // ...user is not the owner...
          ownerIsNotMeDiv.hidden = false; // ...owner exists, and is not user
        }
      } else {
        // ...user did not connect...
        ownerIsSomebodyDiv.hidden = false; // ...retry, pal
      }
    } catch (error) {
      // ...some kind of error happened from trying to get the token's name & owner...
      console.log(error.message);
      // ...is the error about the token not existing...
      if (error.message.includes("ERC721NonexistentToken")) {
        // ...ah, right, token doesn't exist...
        currentNameSpan.innerHTML = "Up for grabs!";
        currentOwnerSpan.innerHTML = "Could be you!";
        // ...did the user connect...
        if (typeof connectedAccount !== "undefined") {
          // ...user did connect...
          ownerIsNobodyDiv.hidden = false; // ...owner does not exist
        } else {
          // ...user did not connect...
          ownerIsSomebodyDiv.hidden = false; // ...retry, pal
        }
      } else {
        // ...uh, well, it's some other error...
        currentNameSpan.innerHTML = "please try...";
        currentOwnerSpan.innerHTML = "...that again";
      }
    }
  } else {
    // ...Metamask is not installed...
    ownerIsSomebodyDiv.hidden = false; // ...retry, pal
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
      args: [colorInput.value.substring(1), renameInput.value],
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
      args: [colorInput.value.substring(1), nameInput.value],
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
