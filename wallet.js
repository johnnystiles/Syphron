// Simplified wallet connection for Syphron
document.addEventListener('DOMContentLoaded', () => {
  // Initialize wallet connection
  initWalletConnection();
});

// Core wallet connection functionality
function initWalletConnection() {
  // Get wallet connect button
  const connectButton = document.querySelector('[id="wallet"]');
  if (!connectButton) return;

  // Setup wallet connection UI
  setupWalletUI();

  // Check if MetaMask is available
  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    connectButton.addEventListener('click', connectWallet);
  } else {
    console.log('MetaMask is not installed');
    connectButton.innerHTML = 'Please install MetaMask';
    connectButton.classList.add('disabled');
    connectButton.setAttribute('disabled', 'disabled');
  }

  // Check if wallet is already connected
  checkConnection();
}

// Setup wallet UI elements
function setupWalletUI() {
  // Create wallet info container if it doesn't exist
  if (!document.getElementById('walletInfo')) {
    const walletInfo = document.createElement('div');
    walletInfo.id = 'walletInfo';
    walletInfo.className = 'wallet-info';
    walletInfo.style.display = 'none';
    walletInfo.innerHTML = `
      <div class="wallet-account" id="walletAccount"></div>
      <div class="wallet-network" id="walletNetwork"></div>
      <button id="disconnectWallet" class="wallet-disconnect">Disconnect</button>
    `;
    
    // Add wallet info to deposit form
    const depositForm = document.querySelector('.deposit-form');
    if (depositForm) {
      depositForm.appendChild(walletInfo);
    }

    // Style wallet info
    const style = document.createElement('style');
    style.textContent = `
      .wallet-info {
        margin-top: 15px;
        padding: 10px;
        background-color: rgba(2, 48, 32, 0.7);
        border: 1px solid var(--neon-green);
        border-radius: 5px;
      }
      
      .wallet-account {
        color: var(--neon-yellow);
        font-family: monospace;
      }
      
      .wallet-network {
        font-size: 0.8rem;
        margin-top: 5px;
      }
      
      .wallet-disconnect {
        background: none;
        border: none;
        color: var(--neon-green);
        padding: 5px;
        margin-top: 10px;
        cursor: pointer;
        text-decoration: underline;
        font-size: 0.9rem;
      }
      
      .wallet-disconnect:hover {
        color: var(--neon-yellow);
      }
    `;
    document.head.appendChild(style);

    // Add disconnect event listener
    document.getElementById('disconnectWallet').addEventListener('click', disconnectWallet);
  }
}

// Connect to MetaMask wallet
async function connectWallet() {
  try {
    // Show connecting state
    const connectButton = document.querySelector('[id="wallet"]');
    connectButton.innerHTML = 'Connecting...';
    
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    
    // Get current network
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const networkName = getNetworkName(chainId);
    
    // Update UI for connected state
    updateConnectedState(account, networkName);
    
    // Setup event listeners
    setupEthereumListeners();
    
    return account;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    const connectButton = document.querySelector('[id="wallet"]');
    connectButton.innerHTML = 'Connect Wallet';
    
    alert(`Failed to connect wallet: ${error.message}`);
  }
}

// Disconnect wallet
function disconnectWallet() {
  // Update UI
  updateDisconnectedState();
  
  // Note: There's no standard method to disconnect in MetaMask
  // We just update our UI to reflect disconnected state
  console.log('Wallet disconnected from application');
}

// Check if already connected
async function checkConnection() {
  if (typeof window.ethereum === 'undefined') return;
  
  try {
    // Get accounts silently (without prompting)
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
      // Get current network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const networkName = getNetworkName(chainId);
      
      // Update UI for connected state
      updateConnectedState(accounts[0], networkName);
      
      // Setup event listeners
      setupEthereumListeners();
    }
  } catch (error) {
    console.error('Error checking connection:', error);
  }
}

// Update UI for connected state
function updateConnectedState(account, networkName) {
  // Update connect button
  const connectButton = document.querySelector('[id="wallet"]');
  if (connectButton) {
    connectButton.innerHTML = 'Wallet Connected';
    connectButton.classList.add('connected');
  }
  
  // Update wallet info
  const walletInfo = document.getElementById('walletInfo');
  const walletAccount = document.getElementById('walletAccount');
  const walletNetwork = document.getElementById('walletNetwork');
  
  if (walletInfo && walletAccount && walletNetwork) {
    walletAccount.textContent = `${account.slice(0, 6)}...${account.slice(-4)}`;
    walletNetwork.textContent = networkName;
    walletInfo.style.display = 'block';
  }
  
  // Enable deposit button
  const depositButton = document.querySelector('.deposit-form .btn:last-child');
  if (depositButton) {
    depositButton.disabled = false;
    depositButton.innerHTML = 'Deposit';
  }
}

// Update UI for disconnected state
function updateDisconnectedState() {
  // Update connect button
  const connectButton = document.querySelector('[id="wallet"]');
  if (connectButton) {
    connectButton.innerHTML = 'Connect Wallet';
    connectButton.classList.remove('connected');
  }
  
  // Hide wallet info
  const walletInfo = document.getElementById('walletInfo');
  if (walletInfo) {
    walletInfo.style.display = 'none';
  }
  
  // Disable deposit button
  const depositButton = document.querySelector('.deposit-form .btn:last-child');
  if (depositButton) {
    depositButton.disabled = true;
    depositButton.innerHTML = 'Connect Wallet First';
  }
}

// Setup Ethereum event listeners
function setupEthereumListeners() {
  if (typeof window.ethereum === 'undefined') return;
  
  // Account changed event
  window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      updateDisconnectedState();
    } else {
      // Account changed
      updateConnectedState(accounts[0], getNetworkName(window.ethereum.chainId));
    }
  });
  
  // Chain changed event
  window.ethereum.on('chainChanged', (chainId) => {
    const networkName = getNetworkName(chainId);
    const walletNetwork = document.getElementById('walletNetwork');
    if (walletNetwork) {
      walletNetwork.textContent = networkName;
    }
    
    // MetaMask recommends reloading the page on chain change
    window.location.reload();
  });
}

// Get network name from chain ID
function getNetworkName(chainId) {
  // Convert chainId to decimal if it's in hex
  const chainIdDecimal = typeof chainId === 'string' && chainId.startsWith('0x') 
    ? parseInt(chainId, 16) 
    : Number(chainId);
  
  const networks = {
    1: 'Ethereum Mainnet',
    5: 'Goerli Testnet',
    11155111: 'Sepolia Testnet',
    56: 'Binance Smart Chain',
    137: 'Polygon',
    42161: 'Arbitrum',
    10: 'Optimism',
    43114: 'Avalanche',
    80001: 'Mumbai Testnet'
  };
  
  return networks[chainIdDecimal] || `Chain ${chainIdDecimal}`;
}
