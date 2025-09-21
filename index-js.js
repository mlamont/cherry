import {
  createWalletClient,
  custom,
  createPublicClient,
  parseEther,
  defineChain,
  formatEther,
  // @ts-ignore
} from "https://esm.sh/viem";
import { contractAddress, abi } from "./constants-js.js";

const OldConnectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const ethAmountInput = document.getElementById("ethAmount");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");

let walletClient;
let publicClient;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });
    await walletClient.requestAddresses();
    // @ts-ignore
    OldConnectButton.innerHTML = "Connected!";
  } else {
    // @ts-ignore
    OldConnectButton.innerHTML = "Please install MetaMask!";
  }
}

async function fund() {
  // @ts-ignore
  const ethAmount = ethAmountInput.value;
  console.log(`Funding with ${ethAmount}...`);

  // do this in case they haven't connected to MM
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });
    const [connectedAccount] = await walletClient.requestAddresses();
    const currentChain = await getCurrentChain(walletClient);

    // we're going to simulate funding the contract w/ ETH
    // and if it passes, then we'll call the fund f'n
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });
    const { request } = await publicClient.simulateContract({
      address: contractAddress,
      abi: abi,
      functionName: "fund",
      account: connectedAccount,
      chain: currentChain,
      value: parseEther(ethAmount),
    });

    // actually calling fund f'n, using walletClient, not publicClient
    const hash = await walletClient.writeContract(request);
    console.log(hash);
  } else {
    // @ts-ignore
    connectButton.innerHTML = "Please install MetaMask!";
  }
}

// @ts-ignore
async function getCurrentChain(client) {
  const chainId = await client.getChainId();
  const currentChain = defineChain({
    id: chainId,
    name: "Custom Chain",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["http://localhost:8545"],
      },
    },
  });
  return currentChain;
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });
    const balance = await publicClient.getBalance({
      address: contractAddress,
    });
    console.log(formatEther(balance));
  }
}

async function withdraw() {
  console.log("Withdrawing contract balance...");

  // do this in case they haven't connected to MM
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });
    const [connectedAccount] = await walletClient.requestAddresses();
    const currentChain = await getCurrentChain(walletClient);

    // simulate the withdraw call to ensure it would succeed
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });
    const { request } = await publicClient.simulateContract({
      address: contractAddress,
      abi: abi,
      functionName: "withdraw",
      account: connectedAccount,
      chain: currentChain,
    });

    // actually calling withdraw, using walletClient
    const hash = await walletClient.writeContract(request);
    console.log(hash);
  } else {
    // @ts-ignore
    connectButton.innerHTML = "Please install MetaMask!";
  }
}

// @ts-ignore
OldConnectButton.onclick = connect;
