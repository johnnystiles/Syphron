// Handle deposit functionality
document.addEventListener('DOMContentLoaded', () => {
  setupDepositForm();
});

// Setup deposit form
function setupDepositForm() {
  // Style deposit form selects
  styleDepositForm();
  
  // Convert inputs to selects for better UX
  convertFormInputsToSelects();
  
  // Add event listeners
  const depositForm = document.querySelector('.deposit-form');
  const depositButton = depositForm?.querySelector('.btn:last-child');
  
  if (depositButton) {
    // Initially disable deposit button
    if (typeof window.ethereum === 'undefined' || !isWalletConnected()) {
      depositButton.disabled = true;
      depositButton.innerHTML = 'Connect Wallet First';
    }
    
    // Add deposit handler
    depositButton.addEventListener('click', handleDeposit);
  }
  
  // Add amount input handler to show equivalent USD value
  const amountInput = document.getElementById('amount');
  if (amountInput) {
    // Position the input container for the max button
    amountInput.parentElement.style.position = 'relative';
    
    // Add MAX button for ETH
    const maxButton = document.createElement('button');
    maxButton.type = 'button';
    maxButton.className = 'max-button';
    maxButton.innerHTML = 'MAX';
    maxButton.style.position = 'absolute';
    maxButton.style.right = '10px';
    maxButton.style.top = '50%';
    maxButton.style.transform = 'translateY(-50%)';
    maxButton.style.zIndex = '2';
    maxButton.style.background = 'transparent';
    maxButton.style.border = 'none';
    maxButton.style.color = 'var(--neon-yellow)';
    maxButton.style.cursor = 'pointer';
    
    maxButton.addEventListener('click', async () => {
      const assetSelect = document.getElementById('asset');
      const selectedAsset = assetSelect?.value;
      
      if (selectedAsset === 'ETH' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const balanceHex = await window.ethereum.request({
              method: 'eth_getBalance',
              params: [accounts[0], 'latest']
            });
            
            // Convert from wei to ETH and leave some for gas
            const balanceETH = parseInt(balanceHex, 16) / 1e18;
            const maxAmount = Math.max(0, balanceETH - 0.01).toFixed(4);
            amountInput.value = maxAmount;
          }
        } catch (error) {
          console.error('Error getting ETH balance:', error);
        }
      }
    });
    
    amountInput.parentElement.appendChild(maxButton);
  }
}

// Check if wallet is connected
function isWalletConnected() {
  return window.ethereum && ethereum.selectedAddress;
}

// Convert inputs to selects for better UX
function convertFormInputsToSelects() {
  // Asset select
  const assetInput = document.getElementById('asset');
  if (assetInput && assetInput.tagName.toLowerCase() === 'input') {
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
    assetInput.parentNode.replaceChild(assetSelect, assetInput);
  }
  
  // Strategy select
  const strategyInput = document.getElementById('strategy');
  if (strategyInput && strategyInput.tagName.toLowerCase() === 'input') {
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
    strategyInput.parentNode.replaceChild(strategySelect, strategyInput);
  }
}

// Style deposit form
function styleDepositForm() {
  const style = document.createElement('style');
  style.textContent = `
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
      flex-direction: column;
      gap: 10px;
    }
    
    .deposit-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid var(--neon-yellow);
      border-top-color: transparent;
      border-radius: 50%;
      animation: spinner 1s linear infinite;
      margin: 0 auto;
    }
    
    @keyframes spinner {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

// Handle deposit submission
async function handleDeposit(e) {
  e.preventDefault();
  
  // Check if wallet is connected
  if (!window.ethereum || !isWalletConnected()) {
    showNotification('Please connect your wallet first', 'error');
    return;
  }
  
  // Get form values
  const amount = document.getElementById('amount')?.value.trim();
  const asset = document.getElementById('asset')?.value;
  const strategy = document.getElementById('strategy')?.value;
  
  // Validate inputs
  if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
    showNotification('Please enter a valid amount', 'error');
    return;
  }
  
  if (!asset) {
    showNotification('Please select an asset', 'error');
    return;
  }
  
  if (!strategy) {
    showNotification('Please select a strategy', 'error');
    return;
  }
  
  try {
    // Show processing notification
    showNotification('Processing your deposit...', 'processing');
    
    // Get current account
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length === 0) {
      showNotification('Wallet disconnected. Please connect your wallet', 'error');
      return;
    }
    
    // For ETH deposits, create a transaction
    if (asset === 'ETH') {
      // Mock contract address - in production, use your actual contract
      const contractAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
      
      // Convert amount to wei (1 ETH = 10^18 wei)
      const amountWei = `0x${(parseFloat(amount) * 1e18).toString(16)}`;
      
      // Send transaction to the contract
      const transactionParams = {
        to: contractAddress,
        from: accounts[0],
        value: amountWei,
        // For a real smart contract, you would include the function call data here
        // data: '0x...'
      };
      
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParams],
      });
      
      // Show success notification with tx hash
      showNotification(
        `Successfully deposited ${amount} ${asset} using ${strategy} strategy!<br>
         <a href="https://etherscan.io/tx/${txHash}" target="_blank" rel="noopener noreferrer" style="color:inherit;">
           Transaction: ${txHash.slice(0, 8)}...${txHash.slice(-6)}
         </a>`,
        'success'
      );
      
      // Reset form
      document.getElementById('amount').value = '';
      
    } else {
      // For ERC-20 tokens, you would need to:
      // 1. Approve the contract to spend tokens
      // 2. Call the deposit function on the contract
      
      // For this demo, we'll just simulate success
      await simulateTransaction();
      
      // Show success notification with mock tx hash
      const mockTxHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      showNotification(
        `Successfully deposited ${amount} ${asset} using ${strategy} strategy!<br>
         <a href="#" style="color:inherit;">
           Transaction: ${mockTxHash.slice(0, 8)}...${mockTxHash.slice(-6)}
         </a>`,
        'success'
      );
      
      // Reset form
      document.getElementById('amount').value = '';
    }
    
  } catch (error) {
    console.error('Deposit error:', error);
    showNotification(`Transaction failed: ${error.message}`, 'error');
  }
}

// Show notification
function showNotification(message, type) {
  const depositForm = document.querySelector('.deposit-form');
  
  // Create or get notification element
  let notification = document.querySelector('.deposit-notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'deposit-notification';
    depositForm.appendChild(notification);
  }
  
  // Update notification based on type
  notification.className = `deposit-notification deposit-${type}`;
  
  if (type === 'processing') {
    notification.innerHTML = `<div class="deposit-spinner"></div>${message}`;
  } else {
    notification.innerHTML = message;
  }
  
  // Auto-hide after delay (except for processing)
  if (type !== 'processing') {
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 8000);
  }
}

// Simulate transaction delay
function simulateTransaction() {
  return new Promise(resolve => setTimeout(resolve, 2000));
}
