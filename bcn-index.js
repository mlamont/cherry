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
const topSpan = document.getElementById("topSpan");
const greetingSpan = document.getElementById("greetingSpan");
const connectButton = document.getElementById("connectButton");
const colorInput = document.getElementById("colorInput");
const namedButton = document.getElementById("namedButton");
const currentNameDiv = document.getElementById("currentNameDiv");
const currentOwnerDiv = document.getElementById("currentOwnerDiv");
const nameInput = document.getElementById("nameInput");
const nameItButton = document.getElementById("nameItButton");
const getNameOf76A923Button = document.getElementById("getNameOf76A923Button");

// initialize viem pieces
let walletClient;
let publicClient;

// keeping the connect() function in index-js.js for now

async function getNameOf76A923() {
  if (typeof window.ethereum !== "undefined") {
    publicClient = createPublicClient({
      chain: sepolia,
      transport: http(),
      //   transport: custom(window.ethereum),
    });
    console.log("public client created");

    const result = await publicClient.readContract({
      address: contractAddress,
      abi: abi,
      functionName: "getName",
      args: ["76A923"],
    });

    console.log(result);
    input.value = result;
  } else {
    connectButton.innerHTML = "Please install MetaMask!";
  }
}

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    topSpan.innerHTML = "";
    publicClient = createPublicClient({
      chain: sepolia,
      transport: http(),
    });
    console.log("public client created from bcn-index.js");
  } else {
    topSpan.innerHTML = "...PLEASE INSTALL METAMASK!";
  }
}

async function named() {
  if (typeof window.ethereum !== "undefined") {
    topSpan.innerHTML = "";
    //
  } else {
    topSpan.innerHTML = "...PLEASE INSTALL METAMASK!";
  }
}

async function nameIt() {
  if (typeof window.ethereum !== "undefined") {
    topSpan.innerHTML = "";
    //
  } else {
    topSpan.innerHTML = "...PLEASE INSTALL METAMASK!";
  }
}

getNameOf76A923Button.onclick = getNameOf76A923;
connectButton.onclick = connect();
namedButton.onclick = named();
nameItButton.onclick = nameIt();
