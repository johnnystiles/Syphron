// Wallet connection utilities
class Web3Utils {
    constructor() {
        this.web3 = null;
        this.provider = null;
        this.accounts = [];
        this.chainId = null;
        this.networkName = null;
        this.connected = false;
        this.walletType = null;
        
        // Bind event listeners
        this.onAccountsChanged = this.onAccountsChanged.bind(this);
        this.onChainChanged = this.onChainChanged.bind(this);
        this.onDisconnect = this.onDisconnect.bind(this);
    }
    
    // Check if MetaMask or other injected provider is available
    hasInjectedProvider() {
        return Boolean(window.ethereum);
    }
    
    // Check if WalletConnect is available (requires script to be loaded)
    hasWalletConnect() {
        return typeof window.WalletConnectProvider !== 'undefined';
    }
    
    // Check if Coinbase Wallet SDK is available (requires script to be loaded)
    hasCoinbaseWallet() {
        return typeof window.CoinbaseWalletSDK !== 'undefined';
    }
    
    // Initialize the Web3 provider
    async initWeb3(providerType = 'injected') {
        try {
            switch (providerType) {
                case 'injected':
                    if (!this.hasInjectedProvider()) {
                        throw new Error('No injected provider found. Please install MetaMask or another wallet extension.');
                    }
                    
                    this.provider = window.ethereum;
                    this.walletType = 'injected';
                    break;
                    
                case 'walletconnect':
                    if (!this.hasWalletConnect()) {
                        throw new Error('WalletConnect is not available. Please make sure the script is loaded.');
                    }
                    
                    this.provider = new window.WalletConnectProvider.default({
                        infuraId: "YOUR_INFURA_ID", // Replace with your Infura ID
                        rpc: {
                            1: "https://mainnet.infura.io/v3/YOUR_INFURA_ID",
                            56: "https://bsc-dataseed.binance.org/",
                            137: "https://polygon-rpc.com",
                            42161: "https://arb1.arbitrum.io/rpc"
                        }
                    });
                    
                    // Enable session (triggers QR Code modal)
                    await this.provider.enable();
                    this.walletType = 'walletconnect';
                    break;
                    
                case 'coinbase':
                    if (!this.hasCoinbaseWallet()) {
                        throw new Error('Coinbase Wallet SDK is not available. Please make sure the script is loaded.');
                    }
                    
                    const coinbaseWallet = new window.CoinbaseWalletSDK({
                        appName: 'Syphron',
                        appLogoUrl: '', // Add your logo URL here
                        darkMode: true,
                        overrideIsMetaMask: false
                    });
                    
                    this.provider = coinbaseWallet.makeWeb3Provider(
                        "https://mainnet.infura.io/v3/YOUR_INFURA_ID", // Replace with your Infura endpoint
                        1 // ETH Mainnet
                    );
                    
                    await this.provider.enable();
                    this.walletType = 'coinbase';
                    break;
                    
                default:
                    throw new Error('Unsupported provider type');
            }
            
            // Initialize Web3 instance
            if (typeof Web3 !== 'undefined') {
                this.web3 = new Web3(this.provider);
            } else if (typeof window.ethers !== 'undefined') {
                // Alternatively use ethers.js
                this.web3 = new window.ethers.providers.Web3Provider(this.provider);
            } else {
                throw new Error('No Web3 library found. Please make sure Web3.js or Ethers.js is loaded.');
            }
            
            // Get connected accounts
            const accounts = await this.provider.request({ method: 'eth_requestAccounts' });
            this.accounts = accounts;
            
            // Get chain ID
            this.chainId = await this.provider.request({ method: 'eth_chainId' });
            this.networkName = this.getNetworkName(this.chainId);
            
            this.connected = true;
            
            // Set up event listeners
            this.setupEventListeners();
            
            return {
                success: true,
                account: this.accounts[0],
                chainId: this.chainId,
                networkName: this.networkName,
                walletType: this.walletType
            };
        } catch (error) {
            console.error('Error initializing Web3:', error);
            
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Disconnect wallet
    async disconnect() {
        if (!this.provider) return;
        
        // WalletConnect-specific disconnect
        if (this.walletType === 'walletconnect' && this.provider.disconnect) {
            await this.provider.disconnect();
        }
        
        // Remove event listeners
        this.removeEventListeners();
        
        // Reset state
        this.web3 = null;
        this.accounts = [];
        this.chainId = null;
        this.networkName = null;
        this.connected = false;
        
        return true;
    }
    
    // Setup event listeners for wallet events
    setupEventListeners() {
        if (!this.provider) return;
        
        if (this.provider.on) {
            // Listen for account changes
            this.provider.on('accountsChanged', this.onAccountsChanged);
            
            // Listen for chain changes
            this.provider.on('chainChanged', this.onChainChanged);
            
            // Listen for disconnect
            this.provider.on('disconnect', this.onDisconnect);
        }
    }
    
    // Remove event listeners
    removeEventListeners() {
        if (!this.provider || !this.provider.removeListener) return;
        
        this.provider.removeListener('accountsChanged', this.onAccountsChanged);
        this.provider.removeListener('chainChanged', this.onChainChanged);
        this.provider.removeListener('disconnect', this.onDisconnect);
    }
    
    // Handler for accounts changed event
    async onAccountsChanged(accounts) {
        this.accounts = accounts;
        
        // If no accounts, user has disconnected
        if (accounts.length === 0) {
            this.connected = false;
            
            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('wallet_disconnected'));
        } else {
            // Dispatch custom event with new account
            window.dispatchEvent(new CustomEvent('wallet_accountChanged', {
                detail: { account: accounts[0] }
            }));
        }
    }
    
    // Handler for chain changed event
    onChainChanged(chainId) {
        this.chainId = chainId;
        this.networkName = this.getNetworkName(chainId);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('wallet_chainChanged', {
            detail: { 
                chainId: chainId,
                networkName: this.networkName
            }
        }));
        
        // Reload page as recommended by MetaMask
        window.location.reload();
    }
    
    // Handler for disconnect event
    onDisconnect(error) {
        this.connected = false;
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('wallet_disconnected', {
            detail: { error: error }
        }));
    }
    
    // Get human-readable network name from chain ID
    getNetworkName(chainId) {
        // Convert chainId to decimal if it's in hex
        const chainIdDecimal = typeof chainId === 'string' && chainId.startsWith('0x') 
            ? parseInt(chainId, 16) 
            : Number(chainId);
        
        const networks = {
            1: 'Ethereum Mainnet',
            3: 'Ropsten Testnet',
            4: 'Rinkeby Testnet',
            5: 'Goerli Testnet',
            42: 'Kovan Testnet',
            56: 'Binance Smart Chain',
            97: 'BSC Testnet',
            137: 'Polygon',
            80001: 'Mumbai Testnet',
            42161: 'Arbitrum',
            42220: 'Celo',
            43114: 'Avalanche',
            250: 'Fantom',
            1313161554: 'Aurora',
            10: 'Optimism'
        };
        
        return networks[chainIdDecimal] || `Chain ${chainIdDecimal}`;
    }
    
    // Switch network
    async switchNetwork(chainId) {
        if (!this.provider) {
            throw new Error('Provider not initialized');
        }
        
        try {
            // Request switch to the desired chain
            await this.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${chainId.toString(16)}` }],
            });
            
            return true;
        } catch (error) {
            // If the chain is not added to the wallet, add it
            if (error.code === 4902) {
                try {
                    // Get network details from chain ID
                    const networkDetails = this.getNetworkDetails(chainId);
                    
                    // Add the chain to the wallet
                    await this.provider.request({
                        method: 'wallet_addEthereumChain',
                        params: [networkDetails],
                    });
                    
                    return true;
                } catch (addError) {
                    throw addError;
                }
            }
            
            throw error;
        }
    }
    
    // Get network details for adding a new chain
    getNetworkDetails(chainId) {
        const networks = {
            1: {
                chainId: '0x1',
                chainName: 'Ethereum Mainnet',
                nativeCurrency: {
                    name: 'Ether',
                    symbol: 'ETH',
                    decimals: 18
                },
                rpcUrls: ['https://mainnet.infura.io/v3/YOUR_INFURA_ID'],
                blockExplorerUrls: ['https://etherscan.io']
            },
            56: {
                chainId: '0x38',
                chainName: 'Binance Smart Chain',
                nativeCurrency: {
                    name: 'BNB',
                    symbol: 'BNB',
                    decimals: 18
                },
                rpcUrls: ['https://bsc-dataseed.binance.org/'],
                blockExplorerUrls: ['https://bscscan.com']
            },
            137: {
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                nativeCurrency: {
                    name: 'MATIC',
                    symbol: 'MATIC',
                    decimals: 18
                },
                rpcUrls: ['https://polygon-rpc.com'],
                blockExplorerUrls: ['https://polygonscan.com']
            },
            42161: {
                chainId: '0xA4B1',
                chainName: 'Arbitrum One',
                nativeCurrency: {
                    name: 'Ethereum',
                    symbol: 'ETH',
                    decimals: 18
                },
                rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                blockExplorerUrls: ['https://arbiscan.io']
            },
            43114: {
                chainId: '0xA86A',
                chainName: 'Avalanche C-Chain',
                nativeCurrency: {
                    name: 'Avalanche',
                    symbol: 'AVAX',
                    decimals: 18
                },
                rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
                blockExplorerUrls: ['https://snowtrace.io']
            }
        };
        
        return networks[chainId] || null;
    }
    
    // Check if user is connected
    isConnected() {
        return this.connected && this.accounts.length > 0;
    }
    
    // Get current account
    getCurrentAccount() {
        return this.accounts[0] || null;
    }
    
    // Format account display (0x1234...5678)
    formatAccount(account = null) {
        const addr = account || this.getCurrentAccount();
        if (!addr) return '';
        
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    }
    
    // Get balance of an account
    async getBalance(address = null) {
        if (!this.web3) throw new Error('Web3 not initialized');
        
        const account = address || this.getCurrentAccount();
        if (!account) throw new Error('No account provided and no current account');
        
        const balance = await this.web3.eth.getBalance(account);
        return this.web3.utils.fromWei(balance, 'ether');
    }
    
    // Basic transaction function
    async sendTransaction(to, value, data = '') {
        if (!this.web3) throw new Error('Web3 not initialized');
        if (!this.isConnected()) throw new Error('Wallet not connected');
        
        const from = this.getCurrentAccount();
        
        try {
            const txHash = await this.provider.request({
                method: 'eth_sendTransaction',
                params: [{
                    from,
                    to,
                    value: this.web3.utils.toHex(this.web3.utils.toWei(value, 'ether')),
                    data
                }]
            });
            
            return {
                success: true,
                txHash
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Create and export a singleton instance
const web3Utils = new Web3Utils();
