// Handle deposit functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set up deposit form
    setupDepositForm();
    
    // Listen for wallet connection events
    listenForWalletEvents();
});

// Set up deposit form
function setupDepositForm() {
    const depositForm = document.querySelector('.deposit-form');
    const depositButton = depositForm ? depositForm.querySelector('.btn:last-child') : null;
    
    if (depositButton) {
        // Initially disable deposit button until wallet connected
        if (!window.web3Utils || !window.web3Utils.isConnected()) {
            depositButton.disabled = true;
            depositButton.innerHTML = 'Connect Wallet First';
        }
        
        // Add event listener for deposit button
        depositButton.addEventListener('click', async function(e) {
            e.preventDefault();
            
            if (!window.web3Utils || !window.web3Utils.isConnected()) {
                alert('Please connect your wallet first');
                return;
            }
            
            // Get form values
            const amountInput = document.getElementById('amount');
            const assetInput = document.getElementById('asset');
            const strategyInput = document.getElementById('strategy');
            
            const amount = amountInput ? amountInput.value.trim() : '';
            const asset = assetInput ? assetInput.value.trim() : '';
            const strategy = strategyInput ? strategyInput.value.trim() : '';
            
            // Validate inputs
            if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
                showDepositError('Please enter a valid amount');
                return;
            }
            
            if (!asset) {
                showDepositError('Please select an asset');
                return;
            }
            
            // Process deposit
            await processDeposit(amount, asset, strategy);
        });
    }
    
    // Add asset dropdown options
    const assetInput = document.getElementById('asset');
    if (assetInput) {
        // Convert to a select element
        const assetSelect = document.createElement('select');
        assetSelect.id = 'asset';
        assetSelect.innerHTML = `
            <option value="">Select Asset</option>
            <option value="ETH">ETH</option>
            <option value="USDC">USDC</option>
            <option value="USDT">USDT</option>
            <option value="DAI">DAI</option>
            <option value="WBTC">WBTC</option>
        `;
        
        // Replace input with select
        assetInput.parentNode.replaceChild(assetSelect, assetInput);
    }
    
    // Add strategy dropdown options
    const strategyInput = document.getElementById('strategy');
    if (strategyInput) {
        // Convert to a select element
        const strategySelect = document.createElement('select');
        strategySelect.id = 'strategy';
        strategySelect.innerHTML = `
            <option value="">Select Strategy</option>
            <option value="Balanced">Balanced</option>
            <option value="Conservative">Conservative</option>
            <option value="Aggressive">Aggressive</option>
            <option value="Yield Farming">Yield Farming</option>
            <option value="Liquidity Provision">Liquidity Provision</option>
        `;
        
        // Replace input with select
        strategyInput.parentNode.replaceChild(strategySelect, strategyInput);
    }
    
    // Style select elements
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .form-group select {
            width: 100%;
            padding: 12px;
            background-color: rgba(1, 26, 18, 0.8);
            border: 1px solid var(--neon-green);
            border-radius: 5px;
            color: var(--text-color);
            font-size: 1rem;
            transition: all 0.3s ease;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2300ff80' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 10px center;
        }
        
        .form-group select:focus {
            outline: none;
            border-color: var(--neon-yellow);
            box-shadow: 0 0 10px var(--neon-yellow);
        }
        
        .form-group select option {
            background-color: rgba(2, 48, 32, 1);
            color: var(--text-color);
        }
        
        .deposit-notification {
            margin-top: 20px;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            transition: all 0.3s ease;
        }
        
        .deposit-error {
            background-color: rgba(255, 51, 102, 0.2);
            border: 1px solid #ff3366;
            color: #ff6688;
        }
        
        .deposit-success {
            background-color: rgba(0, 255, 128, 0.2);
            border: 1px solid var(--neon-green);
            color: var(--neon-green);
        }
        
        .deposit-processing {
            background-color: rgba(212, 255, 0, 0.2);
            border: 1px solid var(--neon-yellow);
            color: var(--neon-yellow);
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
        }
        
        .deposit-spinner {
            width: 20px;
            height: 20px;
            border: 2px solid var(--neon-yellow);
            border-top-color: transparent;
            border-radius: 50%;
            animation: spinner 1s linear infinite;
        }
        
        @keyframes spinner {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleElement);
}

// Listen for wallet events
function listenForWalletEvents() {
    window.addEventListener('wallet_connected', function() {
        // Enable deposit button
        const depositButton = document.querySelector('.deposit-form .btn:last-child');
        if (depositButton) {
            depositButton.disabled = false;
            depositButton.innerHTML = 'Deposit';
        }
        
        // Update deposit form with connected wallet info
        updateDepositFormForConnectedWallet();
    });
    
    window.addEventListener('wallet_disconnected', function() {
        // Disable deposit button
        const depositButton = document.querySelector('.deposit-form .btn:last-child');
        if (depositButton) {
            depositButton.disabled = true;
            depositButton.innerHTML = 'Connect Wallet First';
        }
    });
}

// Update deposit form with connected wallet info
function updateDepositFormForConnectedWallet() {
    // Check if we're on the deposit tab
    const depositTab = document.getElementById('deposit');
    if (!depositTab || !depositTab.classList.contains('active-tab')) return;
    
    // Check if wallet is connected
    if (!window.web3Utils || !window.web3Utils.isConnected()) return;
    
    // Get wallet balance
    window.web3Utils.getBalance()
        .then(balance => {
            const amountInput = document.getElementById('amount');
            if (amountInput) {
                // Add max button
                const maxButton = document.createElement('button');
                maxButton.type = 'button';
                maxButton.className = 'max-button';
                maxButton.innerHTML = 'MAX';
                maxButton.style.position = 'absolute';
                maxButton.style.right = '10px';
                maxButton.style.top = '50%';
                maxButton.style.transform = 'translateY(-50%)';
                maxButton.style.background = 'transparent';
                maxButton.style.border = 'none';
                maxButton.style.color = 'var(--neon-yellow)';
                maxButton.style.cursor = 'pointer';
                maxButton.style.padding = '5px';
                maxButton.style.fontSize = '0.8rem';
                
                // Add event listener
                maxButton.addEventListener('click', function() {
                    const assetSelect = document.getElementById('asset');
                    const selectedAsset = assetSelect ? assetSelect.value : '';
                    
                    // Only set max if ETH is selected
                    if (selectedAsset === 'ETH') {
                        // Leave a little ETH for gas
                        const maxAmount = Math.max(0, parseFloat(balance) - 0.01).toFixed(4);
                        amountInput.value = maxAmount;
                    }
                });
                
                // Position input wrapper for relative positioning
                amountInput.parentElement.style.position = 'relative';
                
                // Add max button to input wrapper
                amountInput.parentElement.appendChild(maxButton);
                
                // Add balance display
                const balanceDisplay = document.createElement('div');
                balanceDisplay.className = 'balance-display';
                balanceDisplay.innerHTML = `Balance: <span id="ethBalance">${parseFloat(balance).toFixed(4)} ETH</span>`;
                balanceDisplay.style.fontSize = '0.8rem';
                balanceDisplay.style.color = 'var(--text-color)';
                balanceDisplay.style.marginTop = '5px';
                balanceDisplay.style.textAlign = 'right';
                
                // Add balance display after input
                amountInput.parentElement.appendChild(balanceDisplay);
            }
        })
        .catch(error => {
            console.error('Error getting balance:', error);
        });
}

// Process deposit
async function processDeposit(amount, asset, strategy) {
    if (!window.web3Utils || !window.web3Utils.isConnected()) {
        showDepositError('Wallet not connected');
        return;
    }
    
    // Create or get notification element
    let notificationEl = document.querySelector('.deposit-notification');
    if (!notificationEl) {
        notificationEl = document.createElement('div');
        notificationEl.className = 'deposit-notification';
        document.querySelector('.deposit-form').appendChild(notificationEl);
    }
    
    // Show processing notification
    notificationEl.className = 'deposit-notification deposit-processing';
    notificationEl.innerHTML = '<div class="deposit-spinner"></div> Processing deposit...';
    
    try {
        // In a real app, this would interact with smart contracts
        // For demo purposes, we'll simulate transaction
        
        // If asset is ETH, use basic ETH send
        if (asset === 'ETH') {
            // This is a mock address - in a real app you would use your smart contract address
            const contractAddress = '0x1234567890123456789012345678901234567890';
            
            const result = await window.web3Utils.sendTransaction(
                contractAddress,
                amount,
                '0x' // empty data for simple ETH transfer
            );
            
            if (result.success) {
                showDepositSuccess(amount, asset, strategy, result.txHash);
            } else {
                showDepositError(`Transaction failed: ${result.error}`);
            }
        } else {
            // For other assets, we'd need to interact with token contracts
            // This is just a simulation
            await simulateDeposit(amount, asset, strategy);
            showDepositSuccess(amount, asset, strategy, '0x' + Math.random().toString(16).substring(2, 34));
        }
    } catch (error) {
        console.error('Deposit error:', error);
        showDepositError(error.message);
    }
}

// Simulate deposit (for demo purposes)
function simulateDeposit(amount, asset, strategy) {
    return new Promise((resolve) => {
        // Simulate blockchain transaction time
        setTimeout(resolve, 2000);
    });
}

// Show deposit error
function showDepositError(message) {
    const depositForm = document.querySelector('.deposit-form');
    
    // Create or get notification element
    let notificationEl = document.querySelector('.deposit-notification');
    if (!notificationEl) {
        notificationEl = document.createElement('div');
        notificationEl.className = 'deposit-notification';
        depositForm.appendChild(notificationEl);
    }
    
    // Show error
    notificationEl.className = 'deposit-notification deposit-error';
    notificationEl.textContent = message;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notificationEl.style.opacity = '0';
        setTimeout(() => {
            notificationEl.remove();
        }, 300);
    }, 5000);
}

// Show deposit success
function showDepositSuccess(amount, asset, strategy, txHash) {
    const depositForm = document.querySelector('.deposit-form');
    
    // Create or get notification element
    let notificationEl = document.querySelector('.deposit-notification');
    if (!notificationEl) {
        notificationEl = document.createElement('div');
        notificationEl.className = 'deposit-notification';
        depositForm.appendChild(notificationEl);
    }
    
    // Format tx hash display
    const shortTxHash = txHash.substring(0, 8) + '...' + txHash.substring(txHash.length - 6);
    
    // Show success
    notificationEl.className = 'deposit-notification deposit-success';
    notificationEl.innerHTML = `
        <p>Successfully deposited ${amount} ${asset} using ${strategy} strategy!</p>
        <p style="margin-top: 10px; font-size: 0.8rem;">
            Transaction: <a href="#" style="color: inherit;">${shortTxHash}</a>
        </p>
    `;
    
    // Reset form
    const amountInput = document.getElementById('amount');
    if (amountInput) {
        amountInput.value = '';
    }
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
        notificationEl.style.opacity = '0';
        setTimeout(() => {
            notificationEl.remove();
        }, 300);
    }, 8000);
}
