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
// const getNameOf76A923Button = document.getElementById("getNameOf76A923Button");
const connectButton = document.getElementById("connectButton");
const colorInput = document.getElementById("colorInput");
const namedButton = document.getElementById("namedButton");
const currentNameSpan = document.getElementById("currentNameSpan");
const currentOwnerSpan = document.getElementById("currentOwnerSpan");
const ownerIsNobodyDiv = document.getElementById("ownerIsNobodyDiv");

// initialize viem pieces
let walletClient;
let publicClient;

let tokenName;
let tokenOwner;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      chain: sepolia,
      transport: http(),
    });
    await walletClient.requestAddresses();
    console.log("wallet client created from connect() in bcn-index.js");
    connectButton.innerHTML = "(connected)";
  } else {
    connectButton.innerHTML = "...PLEASE INSTALL METAMASK!";
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
      ownerIsNobodyDiv.hidden = true;
      ownerIsSomebodyDiv.hidden = false;
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
