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
const connectButton = document.getElementById("connectButton");
const input = document.getElementById("input");
// const getColorhexButton = document.getElementById("getColorhexButton");
// const getIdButton = document.getElementById("getIdButton");
const getNameOf76A923Button = document.getElementById("getNameOf76A923Button");

// initialize viem pieces
// let walletClient;
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

getNameOf76A923Button.onclick = getNameOf76A923;
