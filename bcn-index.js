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
const ownerIsNobodyDiv = document.getElementById("ownerIsNobodyDiv");
const ownerIsSomebodyDiv = document.getElementById("ownerIsSomebodyDiv");

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
      currentNameSpan.innerHTML = tokenName;
      currentOwnerSpan.innerHTML = tokenOwner;

      // do tests to see if connectedAccount is same as tokenOwner
      // ...yeesh, I don't like this if-else-ing, neither my DIV options for them
      if (connectedAccount !== "") {
        [connectedAccount] = await walletClient.requestAddresses();
        if (connectedAccount == tokenOwner) {
          ownerIsNobodyDiv.hidden = true;
          ownerIsSomebodyDiv.hidden = true;
          ownerIsMeDiv.hidden = false;
        } else {
          ownerIsNobodyDiv.hidden = true;
          ownerIsSomebodyDiv.hidden = false;
          ownerIsMeDiv.hidden = true;
        }
      } else {
        ownerIsNobodyDiv.hidden = true;
        ownerIsSomebodyDiv.hidden = false;
        ownerIsMeDiv.hidden = true;
      }
    } catch (error) {
      console.log(error.message);
      if (error.message.includes("ERC721NonexistentToken")) {
        currentNameSpan.innerHTML = "Up for grabs!";
        currentOwnerSpan.innerHTML = "Could be you!";
        ownerIsNobodyDiv.hidden = false;
        ownerIsSomebodyDiv.hidden = true;
      } else {
        currentNameSpan.innerHTML = "please try...";
        currentOwnerSpan.innerHTML = "...that again";
        ownerIsNobodyDiv.hidden = true;
        ownerIsSomebodyDiv.hidden = true;
      }
    }
  } else {
    currentNameSpan.innerHTML = "please first...";
    currentOwnerSpan.innerHTML = "...install Metamask";
    ownerIsNobodyDiv.hidden = true;
    ownerIsSomebodyDiv.hidden = true;
  }
}

connectButton.onclick = connect;
namedButton.onclick = named;
