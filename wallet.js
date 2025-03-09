// Wallet connection interface for Syphron
document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI elements
    initializeWalletUI();
    
    // Check if Web3 is available
    checkWeb3Availability();
    
    // Set up wallet connection buttons
    setupWalletButtons();
    
    // Listen for wallet events
    setupWalletEventListeners();
});

// Initialize wallet-related UI elements
function initializeWalletUI() {
    // Add wallet connection modal to the body
    const modalHtml = `
    <div id="walletModal" class="wallet-modal">
        <div class="wallet-modal-content">
            <div class="wallet-modal-header">
                <h3>Connect Your Wallet</h3>
                <span class="wallet-modal-close">&times;</span>
            </div>
            <div class="wallet-modal-body">
                <div class="wallet-option" data-wallet="metamask">
                    <img src="https://cdn.cdnlogo.com/logos/m/79/metamask.svg" alt="MetaMask">
                    <span>MetaMask</span>
                </div>
                <div class="wallet-option" data-wallet="coinbase">
                    <img src="https://seeklogo.com/images/C/coinbase-wallet-logo-B3624DBF74-seeklogo.com.png" alt="Coinbase Wallet">
                    <span>Coinbase Wallet</span>
                </div>
                <div class="wallet-option" data-wallet="walletconnect">
                    <img src="https://seeklogo.com/images/W/walletconnect-logo-EE83B50C97-seeklogo.com.png" alt="WalletConnect">
                    <span>WalletConnect</span>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Add modal styles
    const modalStyles = `
    <style>
        .wallet-modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
        }
        
        .wallet-modal-content {
            background-color: var(--darker-green);
            margin: 15% auto;
            padding: 0;
            width: 400px;
            max-width: 90%;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 255, 128, 0.3);
            border: 1px solid var(--neon-green);
            animation: modalFadeIn 0.3s ease;
        }
        
        @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .wallet-modal-header {
            padding: 20px;
            border-bottom: 1px solid var(--neon-green);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .wallet-modal-header h3 {
            margin: 0;
            color: var(--neon-yellow);
            font-size: 1.2rem;
        }
        
        .wallet-modal-close {
            color: var(--neon-green);
            font-size: 1.5rem;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .wallet-modal-close:hover {
            color: var(--neon-yellow);
        }
        
        .wallet-modal-body {
            padding: 20px;
        }
        
        .wallet-option {
            display: flex;
            align-items: center;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
            background-color: rgba(2, 48, 32, 0.7);
            border: 1px solid rgba(0, 255, 128, 0.2);
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .wallet-option:hover {
            border-color: var(--neon-yellow);
            box-shadow: 0 0 10px rgba(212, 255, 0, 0.3);
            transform: translateY(-2px);
        }
        
        .wallet-option img {
            width: 30px;
            height: 30px;
            margin-right: 15px;
            border-radius: 4px;
        }
        
        .wallet-option span {
            color: var(--text-color);
            font-size: 1rem;
        }
        
        .wallet-button {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .wallet-info {
            display: none;
            padding: 8px 12px;
            background-color: rgba(2, 48, 32, 0.7);
            border: 1px solid var(--neon-green);
            border-radius: 5px;
            color: var(--neon-yellow);
            margin-top: 15px;
        }
        
        .wallet-account {
            font-family: monospace;
            letter-spacing: 1px;
        }
        
        .wallet-network {
            font-size: 0.8rem;
            color: var(--text-color);
            margin-top: 5px;
        }
        
        .wallet-disconnect {
            margin-left: 10px;
            color: var(--neon-green);
            cursor: pointer;
            font-size: 0.9rem;
            text-decoration: underline;
        }
        
        .wallet-disconnect:hover {
            color: var(--neon-yellow);
        }
    </style>
    `;
    
    // Add modal and styles to document
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.head.insertAdjacentHTML('beforeend', modalStyles);
    
    // Update connect wallet button styling
    const connectBtns = document.querySelectorAll('[id="wallet"]');
    connectBtns.forEach(btn => {
        btn.innerHTML = '<span>Connect Wallet</span>';
        btn.classList.add('wallet-button');
    });
    
    // Setup wallet info container
    const depositForm = document.querySelector('.deposit-form');
    if (depositForm) {
        const walletInfo = document.createElement('div');
        walletInfo.className = 'wallet-info';
        walletInfo.id = 'walletInfo';
        walletInfo.innerHTML = `
            <div class="wallet-account" id="walletAccount"></div>
            <div class="wallet-network" id="walletNetwork"></div>
            <div class="wallet-disconnect" id="walletDisconnect">Disconnect</div>
        `;
        depositForm.appendChild(walletInfo);
    }
}

// Check if Web3 is available
function checkWeb3Availability() {
    let web3Available = false;
    let message = '';
    
    if (typeof window.ethereum !== 'undefined') {
        web3Available = true;
        message = 'Web3 is available via browser wallet (MetaMask, etc.)';
    } else {
        message = 'No Web3 provider detected. Please install MetaMask or use a Web3-enabled browser.';
    }
    
    console.log(message);
    
    // Update UI based on availability
    const connectBtns = document.querySelectorAll('[id="wallet"]');
    connectBtns.forEach(btn => {
        if (!web3Available) {
            btn.setAttribute('data-tooltip', 'No Web3 wallet detected. Please install MetaMask or use a Web3-enabled browser.');
            btn.classList.add('disabled');
        }
    });
}

// Set up wallet connection buttons
function setupWalletButtons() {
    // Get modal elements
    const modal = document.getElementById('walletModal');
    const closeBtn = document.querySelector('.wallet-modal-close');
    const walletOptions = document.querySelectorAll('.wallet-option');
    
    // Connect wallet buttons - open modal
    const connectBtns = document.querySelectorAll('[id="wallet"]');
    connectBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // If already connected, show wallet info instead
            if (window.web3Utils && window.web3Utils.isConnected()) {
                showWalletInfo();
                return;
            }
            
            modal.style.display = 'block';
        });
    });
    
    // Close modal when clicking on X
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Wallet option clicks
    walletOptions.forEach(option => {
        option.addEventListener('click', function() {
            const walletType = this.getAttribute('data-wallet');
            connectWallet(walletType);
            modal.style.display = 'none';
        });
    });
    
    // Disconnect wallet
    const disconnectBtn = document.getElementById('walletDisconnect');
    if (disconnectBtn) {
        disconnectBtn.addEventListener('click', disconnectWallet);
    }
}

// Set up wallet event listeners
function setupWalletEventListeners() {
    // Listen for wallet events
    window.addEventListener('wallet_connected', function(e) {
        showWalletInfo(e.detail);
        updateButtonsConnected(true);
    });
    
    window.addEventListener('wallet_disconnected', function() {
        hideWalletInfo();
        updateButtonsConnected(false);
    });
    
    window.addEventListener('wallet_accountChanged', function(e) {
        updateWalletInfo(e.detail);
    });
    
    window.addEventListener('wallet_chainChanged', function(e) {
        updateWalletInfo(e.detail);
    });
}

// Connect to wallet
async function connectWallet(walletType) {
    // Make sure web3Utils is loaded
    if (!window.web3Utils) {
        console.error('web3Utils not loaded');
        alert('Web3 utilities not loaded. Please refresh the page and try again.');
        return;
    }
    
    // Map wallet types to provider types
    const providerType = walletType === 'metamask' ? 'injected' : walletType;
    
    try {
        // Loading state
        updateButtonsLoading(true);
        
        // Initialize Web3 with selected provider
        const result = await window.web3Utils.initWeb3(providerType);
        
        if (result.success) {
            // Dispatch connected event
            window.dispatchEvent(new CustomEvent('wallet_connected', {
                detail: {
                    account: result.account,
                    chainId: result.chainId,
                    networkName: result.networkName,
                    walletType: result.walletType
                }
            }));
            
            console.log(`Connected to ${result.networkName} with account ${result.account}`);
        } else {
            console.error('Connection failed:', result.error);
            alert(`Failed to connect: ${result.error}`);
            updateButtonsLoading(false);
        }
    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert(`Error connecting wallet: ${error.message}`);
        updateButtonsLoading(false);
    }
}

// Disconnect wallet
async function disconnectWallet() {
    if (!window.web3Utils) return;
    
    try {
        await window.web3Utils.disconnect();
        console.log('Wallet disconnected');
        
        // Hide wallet info
        hideWalletInfo();
        
        // Update button state
        updateButtonsConnected(false);
    } catch (error) {
        console.error('Error disconnecting wallet:', error);
    }
}

// Show wallet info
function showWalletInfo(data = null) {
    const walletInfo = document.getElementById('walletInfo');
    const walletAccount = document.getElementById('walletAccount');
    const walletNetwork = document.getElementById('walletNetwork');
    
    if (walletInfo && walletAccount && walletNetwork) {
        // If no data passed, use current web3Utils state
        if (!data && window.web3Utils) {
            data = {
                account: window.web3Utils.getCurrentAccount(),
                networkName: window.web3Utils.networkName
            };
        }
        
        if (data && data.account) {
            // Format account if web3Utils is available
            const formattedAccount = window.web3Utils 
                ? window.web3Utils.formatAccount(data.account) 
                : data.account.substring(0, 6) + '...' + data.account.substring(data.account.length - 4);
            
            walletAccount.textContent = formattedAccount;
            walletNetwork.textContent = data.networkName || 'Unknown Network';
            walletInfo.style.display = 'block';
        }
    }
    
    // Update UI for connected state
    updateButtonsConnected(true);
}

// Hide wallet info
function hideWalletInfo() {
    const walletInfo = document.getElementById('walletInfo');
    if (walletInfo) {
        walletInfo.style.display = 'none';
    }
}

// Update wallet info
function updateWalletInfo(data) {
    const walletAccount = document.getElementById('walletAccount');
    const walletNetwork = document.getElementById('walletNetwork');
    
    if (data.account && walletAccount) {
        const formattedAccount = window.web3Utils 
            ? window.web3Utils.formatAccount(data.account) 
            : data.account.substring(0, 6) + '...' + data.account.substring(data.account.length - 4);
        
        walletAccount.textContent = formattedAccount;
    }
    
    if (data.networkName && walletNetwork) {
        walletNetwork.textContent = data.networkName;
    }
}

// Update buttons for loading state
function updateButtonsLoading(isLoading) {
    const connectBtns = document.querySelectorAll('[id="wallet"]');
    connectBtns.forEach(btn => {
        if (isLoading) {
            btn.innerHTML = '<span>Connecting...</span>';
            btn.classList.add('loading');
        } else {
            btn.innerHTML = '<span>Connect Wallet</span>';
            btn.classList.remove('loading');
        }
    });
}

// Update buttons for connected state
function updateButtonsConnected(isConnected) {
    const connectBtns = document.querySelectorAll('[id="wallet"]');
    connectBtns.forEach(btn => {
        if (isConnected) {
            btn.innerHTML = '<span>Wallet Connected</span>';
            btn.classList.add('connected');
            btn.classList.remove('loading');
        } else {
            btn.innerHTML = '<span>Connect Wallet</span>';
            btn.classList.remove('connected');
            btn.classList.remove('loading');
        }
    });
    
    // If in deposit tab, also update deposit button
    if (isConnected) {
        const depositBtn = document.querySelector('.deposit-form .btn:last-child');
        if (depositBtn) {
            depositBtn.innerHTML = 'Deposit Funds';
            depositBtn.disabled = false;
        }
    }
}

// Function to load necessary Web3 libraries
function loadWeb3Libraries() {
    // Only load if not already loaded
    if (typeof Web3 !== 'undefined' || typeof window.ethereum !== 'undefined') return;
    
    // Create script elements
    const web3Script = document.createElement('script');
    web3Script.src = 'https://cdnjs.cloudflare.com/ajax/libs/web3/1.7.0/web3.min.js';
    web3Script.async = true;
    
    const walletConnectScript = document.createElement('script');
    walletConnectScript.src = 'https://unpkg.com/@walletconnect/web3-provider@1.8.0/dist/umd/index.min.js';
    walletConnectScript.async = true;
    
    const coinbaseScript = document.createElement('script');
    coinbaseScript.src = 'https://unpkg.com/@coinbase/wallet-sdk@3.6.0/dist/index.min.js';
    coinbaseScript.async = true;
    
    // Append scripts to document
    document.head.appendChild(web3Script);
    document.head.appendChild(walletConnectScript);
    document.head.appendChild(coinbaseScript);
    
    console.log('Loading Web3 libraries...');
}
