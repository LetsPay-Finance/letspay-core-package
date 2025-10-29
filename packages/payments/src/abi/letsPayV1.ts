// Minimal ABI subset for LetsPayHBAR_V1_UUPS proxy interactions
export const abi = [
  {
    "type": "function",
    "name": "signup",
    "stateMutability": "nonpayable",
    "inputs": [],
    "outputs": []
  },
  {
    "type": "function",
    "name": "fundContract",
    "stateMutability": "payable",
    "inputs": [],
    "outputs": []
  },
  {
    "type": "function",
    "name": "createEscrow",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "merchant", "type": "address" },
      { "name": "otherParticipants", "type": "address[]" },
      { "name": "otherShares", "type": "uint256[]" },
      { "name": "total", "type": "uint256" }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "accept",
    "stateMutability": "nonpayable",
    "inputs": [{ "name": "escrowId", "type": "uint256" }],
    "outputs": []
  },
  {
    "type": "function",
    "name": "cancelEscrow",
    "stateMutability": "nonpayable",
    "inputs": [{ "name": "escrowId", "type": "uint256" }],
    "outputs": []
  },
  {
    "type": "function",
    "name": "repayCredit",
    "stateMutability": "payable",
    "inputs": [],
    "outputs": []
  },
  { "type": "function", "name": "credit", "stateMutability": "view", "inputs": [{ "name": "user", "type": "address" }], "outputs": [{ "type": "uint256" }] },
  { "type": "function", "name": "signedUp", "stateMutability": "view", "inputs": [{ "name": "user", "type": "address" }], "outputs": [{ "type": "bool" }] },
  { "type": "function", "name": "getPendingEscrowsFor", "stateMutability": "view", "inputs": [{ "name": "user", "type": "address" }], "outputs": [{ "type": "uint256[]" }] },
  { "type": "function", "name": "escrowDetails", "stateMutability": "view", "inputs": [{ "name": "escrowId", "type": "uint256" }], "outputs": [{ "type": "tuple", "components": [{ "name": "merchant", "type": "address" }, { "name": "total", "type": "uint256" }] }] },
  { "type": "function", "name": "getUserHistory", "stateMutability": "view", "inputs": [{ "name": "user", "type": "address" }], "outputs": [{ "type": "bytes" }] }
];


