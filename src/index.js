const ethers = window.ethers;

// Add popup styles to document
const style = document.createElement('style');
style.textContent = `
  .wallet-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 32px;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    z-index: 1000;
    min-width: 420px;
    max-width: 480px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
  .wallet-popup-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    z-index: 999;
  }
  .wallet-popup-header {
    margin-bottom: 24px;
  }
  .wallet-popup-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .wallet-popup-title h3 {
    font-size: 24px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
  }
  .wallet-popup-close {
    cursor: pointer;
    font-size: 24px;
    color: #666;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
  }
  .wallet-popup-close:hover {
    background-color: #f5f5f5;
    color: #333;
  }
  .wallet-popup-content {
    color: #4a4a4a;
  }
  .wallet-popup-content > div:not(.wallet-address):not(.wallet-network) {
    font-size: 15px;
    color: #666;
    margin: 12px 0;
    display: flex;
    align-items: center;
  }
  .wallet-popup-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 24px;
  }
  .wallet-popup-actions-row {
    display: flex;
    gap: 12px;
  }
  .wallet-address {
    background: #f8f9fa;
    padding: 16px;
    border-radius: 12px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    margin: 16px 0;
    word-break: break-all;
    font-size: 15px;
    border: 1px solid #e9ecef;
    line-height: 1.5;
  }
  .wallet-network {
    background: #e8f5e9;
    padding: 10px 20px;
    border-radius: 12px;
    display: inline-block;
    margin: 16px 0;
    font-size: 15px;
    font-weight: 500;
    color: #2e7d32;
  }
  .explorer-link {
    flex: 1;
    background: #f8f9fa;
    color: #2196F3;
    text-decoration: none;
    padding: 12px 20px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 500;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid #e9ecef;
  }
  .explorer-link:hover {
    background: #f1f3f5;
    color: #1976D2;
    transform: translateY(-1px);
  }
  .copy-button {
    flex: 1;
    background: #f8f9fa;
    color: #2196F3;
    border: 1px solid #e9ecef;
    padding: 12px 20px;
    border-radius: 12px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 500;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .copy-button:hover {
    background: #f1f3f5;
    color: #1976D2;
    transform: translateY(-1px);
  }
  .disconnect-button {
    width: 100%;
    background: #fff5f5;
    color: #dc3545;
    border: 1px solid #ffe3e3;
    padding: 14px 20px;
    border-radius: 12px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 500;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .disconnect-button:hover {
    background: #ffe3e3;
    color: #c82333;
    transform: translateY(-1px);
  }
  .hr-divider {
    border: none;
    border-top: 1px solid #e9ecef;
    width: 100%;
    margin: 24px 0;
  }
  .wallet-selection-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    min-width: 380px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
  .wallet-option {
    display: flex;
    align-items: center;
    padding: 16px;
    margin: 8px 0;
    border-radius: 12px;
    cursor: pointer;
    transition: background-color 0.2s;
    border: 1px solid #e9ecef;
  }
  .wallet-option:hover {
    background-color: #f8f9fa;
  }
  .wallet-option img {
    width: 32px;
    height: 32px;
    margin-right: 12px;
  }
  .wallet-option-name {
    font-size: 16px;
    font-weight: 500;
    color: #1a1a1a;
  }
  .wallet-button {
    background: #ffffff;
    color: #1a1a1a;
    border: 1px solid #e9ecef;
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  .wallet-button:hover {
    background: #f8f9fa;
    border-color: #dee2e6;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  .wallet-button .wallet-balance {
    color: #2196F3;
    font-weight: 600;
  }
  .wallet-button .wallet-divider {
    width: 1px;
    height: 20px;
    background: #e9ecef;
  }
  .wallet-button .wallet-address-text {
    color: #666;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  }
  .wallet-button.connected {
    background: #f8f9fa;
    border-color: #e9ecef;
  }
  .wallet-button.connected:hover {
    background: #f1f3f5;
  }
`;
document.head.appendChild(style);

// Default supported wallets
let SUPPORTED_WALLETS = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: 'https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg',
    getProvider: () => window.ethereum
  }
];

class WalletConnector {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.account = null;
    this.chainId = null;
    this.balance = null;
    this.onAccountChange = null;
    this.onChainChange = null;
    this.selectedWallet = null;
  }

  async connect(walletId) {
    try {
      const wallet = SUPPORTED_WALLETS.find(w => w.id === walletId);
      if (!wallet) {
        throw new Error('Unsupported wallet');
      }

      const provider = wallet.getProvider();
      if (!provider) {
        throw new Error(`${wallet.name} not found. Please install ${wallet.name} extension.`);
      }

      this.selectedWallet = wallet;
      this.provider = new ethers.BrowserProvider(provider);
      this.signer = await this.provider.getSigner();
      this.account = await this.signer.getAddress();
      this.chainId = (await this.provider.getNetwork()).chainId;
      await this.updateBalance();

      // Set up event listeners
      provider.on('accountsChanged', this.handleAccountsChanged.bind(this));
      provider.on('chainChanged', this.handleChainChanged.bind(this));

      return {
        account: this.account,
        chainId: this.chainId,
        balance: this.balance,
        provider: this.provider,
        signer: this.signer,
        wallet: wallet.id
      };
    } catch (error) {
      throw error;
    }
  }

  async updateBalance() {
    if (this.provider && this.account) {
      const balance = await this.provider.getBalance(this.account);
      this.balance = ethers.formatEther(balance);
    }
  }

  async checkAndSwitchChain(chainInfo) {
    if (!chainInfo) return;

    try {
      const currentChainId = (await this.provider.getNetwork()).chainId;
      
      if (currentChainId !== chainInfo.chainId) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainInfo.chainId }],
        });
      }
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [chainInfo],
          });
        } catch (addError) {
          throw new Error('Failed to add the chain to MetaMask');
        }
      } else {
        throw new Error('Failed to switch to the specified chain');
      }
    }
  }

  async signMessage(message) {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }
    return await this.signer.signMessage(message);
  }

  async handleAccountsChanged(accounts) {
    this.account = accounts[0];
    await this.updateBalance();
    if (this.onAccountChange) {
      this.onAccountChange(this.account);
    }
  }

  async handleChainChanged(chainId) {
    this.chainId = chainId;
    await this.updateBalance();
    if (this.onChainChange) {
      this.onChainChange(chainId);
    }
  }

  on(event, callback) {
    if (event === 'accountChange') {
      this.onAccountChange = callback;
    } else if (event === 'chainChange') {
      this.onChainChange = callback;
    }
  }

  async disconnect() {
    if (this.selectedWallet && this.selectedWallet.getProvider()) {
      const provider = this.selectedWallet.getProvider();
      provider.removeAllListeners('accountsChanged');
      provider.removeAllListeners('chainChanged');
    }
    
    // Clear local state
    this.provider = null;
    this.signer = null;
    this.account = null;
    this.chainId = null;
    this.balance = null;
    this.selectedWallet = null;

    // Emit disconnect event if callback exists
    if (this.onAccountChange) {
      this.onAccountChange(null);
    }
  }
}

class WalletButton {
  constructor(options = {}) {
    this.options = {
      buttonText: 'Connect Wallet',
      buttonClass: 'wallet-button',
      styles: {
        // Button styles
        button: {
          background: '#ffffff',
          color: '#1a1a1a',
          border: '1px solid #e9ecef',
          padding: '12px 24px',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: '500',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          hoverBackground: '#f8f9fa',
          hoverBorderColor: '#dee2e6',
          hoverBoxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
        },
        // Connected state styles
        connected: {
          background: '#f8f9fa',
          borderColor: '#e9ecef',
          hoverBackground: '#eeeeee'
        },
        // Balance text styles
        balance: {
          color: '#2196F3',
          fontWeight: '600'
        },
        // Address text styles
        address: {
          color: '#666',
          fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace"
        },
        // Divider styles
        divider: {
          width: '1px',
          height: '20px',
          background: '#e9ecef'
        }
      },
      ...options
    };
    
    this.wallet = new WalletConnector();
    this.element = null;
    this.isConnected = false;
    this.popup = null;

    // Apply custom styles
    this.applyCustomStyles();

    // Check connection status when the button is created
    this.checkConnection();
  }

  applyCustomStyles() {
    const styleElement = document.createElement('style');
    const styles = this.options.styles || {};
    
    // Default styles
    const defaultStyles = {
        button: {
            background: '#ffffff',
            color: '#2196F3',
            border: '1px solid #e0e0e0',
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '500',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            hoverBackground: '#f5f5f5',
            hoverBorderColor: '#2196F3',
            hoverBoxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            width: 'auto',
            minWidth: '320px',
            maxWidth: '420px'
        },
        connected: {
            background: '#f5f5f5',
            borderColor: '#e0e0e0',
            hoverBackground: '#eeeeee'
        },
        balance: {
            color: '#2196F3',
            fontWeight: '600'
        },
        address: {
            color: '#666666',
            fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace"
        }
    };

    // Merge custom styles with defaults
    const mergedStyles = {
        button: { ...defaultStyles.button, ...(styles.button || {}) },
        connected: { ...defaultStyles.connected, ...(styles.connected || {}) },
        balance: { ...defaultStyles.balance, ...(styles.balance || {}) },
        address: { ...defaultStyles.address, ...(styles.address || {}) }
    };

    const css = `
        .wallet-button {
            background: ${mergedStyles.button.background};
            color: ${mergedStyles.button.color};
            border: ${mergedStyles.button.border};
            padding: ${mergedStyles.button.padding};
            border-radius: ${mergedStyles.button.borderRadius};
            font-size: ${mergedStyles.button.fontSize};
            font-weight: ${mergedStyles.button.fontWeight};
            box-shadow: ${mergedStyles.button.boxShadow};
            width: ${mergedStyles.button.width};
            min-width: ${mergedStyles.button.minWidth};
            max-width: ${mergedStyles.button.maxWidth};
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }

        .wallet-button:hover {
            background: ${mergedStyles.button.hoverBackground};
            border-color: ${mergedStyles.button.hoverBorderColor};
            box-shadow: ${mergedStyles.button.hoverBoxShadow};
        }

        .wallet-button.connected {
            background: ${mergedStyles.connected.background};
            border-color: ${mergedStyles.connected.borderColor};
        }

        .wallet-button.connected:hover {
            background: ${mergedStyles.connected.hoverBackground};
        }

        .wallet-button .balance {
            color: ${mergedStyles.balance.color};
            font-weight: ${mergedStyles.balance.fontWeight};
            white-space: nowrap;
        }

        .wallet-button .address {
            color: ${mergedStyles.address.color};
            font-family: ${mergedStyles.address.fontFamily};
            font-size: 12px;
            word-break: break-all;
            flex: 1;
            text-align: right;
        }
    `;

    styleElement.textContent = css;
    document.head.appendChild(styleElement);
  }

  // Static method to configure supported wallets
  static configureSupportedWallets(wallets) {
    if (!Array.isArray(wallets)) {
      throw new Error('Wallets configuration must be an array');
    }
    
    // Validate wallet configuration
    wallets.forEach(wallet => {
      if (!wallet.id || !wallet.name || !wallet.getProvider) {
        throw new Error('Each wallet must have id, name, and getProvider function');
      }
    });

    SUPPORTED_WALLETS = wallets;
  }

  formatAddress(address) {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  }

  formatBalance(balance) {
    return balance ? Number(balance).toFixed(4) : '0.0000';
  }

  updateButtonText() {
    if (this.element && this.isConnected && this.wallet.account) {
      this.element.innerHTML = `
        <span class="wallet-balance">${this.formatBalance(this.wallet.balance)} ETH</span>
        <span class="wallet-divider"></span>
        <span class="wallet-address-text">${this.formatAddress(this.wallet.account)}</span>
      `;
      this.element.classList.add('connected');
      this.element.style.display = 'flex';
      this.element.style.alignItems = 'center';
      this.element.style.justifyContent = 'center';
      this.element.style.padding = '12px 24px';
    } else if (this.element) {
      this.element.textContent = this.options.buttonText;
      this.element.classList.remove('connected');
    }
  }

  showWalletSelection() {
    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'wallet-popup-backdrop';
    document.body.appendChild(backdrop);

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'wallet-selection-popup';

    // Create popup content
    popup.innerHTML = `
      <div class="wallet-popup-header">
        <div class="wallet-popup-title">
          <h3>Connect Wallet</h3>
          <span class="wallet-popup-close">&times;</span>
        </div>
        <hr class="hr-divider">
      </div>
      <div class="wallet-popup-content">
        ${SUPPORTED_WALLETS.map(wallet => `
          <div class="wallet-option" data-wallet-id="${wallet.id}">
            <img src="${wallet.icon}" alt="${wallet.name}" />
            <span class="wallet-option-name">${wallet.name}</span>
          </div>
        `).join('')}
      </div>
    `;

    // Add popup to body
    document.body.appendChild(popup);

    // Add event listeners
    const closeBtn = popup.querySelector('.wallet-popup-close');
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(backdrop);
      document.body.removeChild(popup);
    });

    backdrop.addEventListener('click', () => {
      document.body.removeChild(backdrop);
      document.body.removeChild(popup);
    });

    // Add wallet selection handlers
    const walletOptions = popup.querySelectorAll('.wallet-option');
    walletOptions.forEach(option => {
      option.addEventListener('click', async () => {
        const walletId = option.dataset.walletId;
        try {
          await this.wallet.connect(walletId);
          this.isConnected = true;
          this.updateButtonText();
          if (this.options.onConnect) {
            this.options.onConnect(this.wallet);
          }
          document.body.removeChild(backdrop);
          document.body.removeChild(popup);
        } catch (error) {
          if (this.options.onError) {
            this.options.onError(error);
          } else {
            console.error('Wallet connection error:', error);
          }
        }
      });
    });
  }

  createButton() {
    const button = document.createElement('button');
    button.className = this.options.buttonClass;
    
    // Set initial button text based on connection status
    if (this.isConnected) {
      this.updateButtonText();
    } else {
      button.textContent = this.options.buttonText;
    }
    
    button.addEventListener('click', async () => {
      try {
        if (!this.isConnected) {
          this.showWalletSelection();
        } else {
          this.showWalletInfo();
        }
      } catch (error) {
        if (this.options.onError) {
          this.options.onError(error);
        } else {
          console.error('Wallet connection error:', error);
        }
      }
    });

    this.element = button;
    return button;
  }

  async showWalletInfo() {
    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'wallet-popup-backdrop';
    document.body.appendChild(backdrop);

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'wallet-popup';

    // Get network name
    const network = await this.wallet.provider.getNetwork();
    const networkName = network.name === 'homestead' ? 'Ethereum Mainnet' : network.name;

    // Create popup content
    popup.innerHTML = `
      <div class="wallet-popup-header">
        <div class="wallet-popup-title">
          <h3>Account Details</h3>
          <span class="wallet-popup-close">&times;</span>
        </div>
        <hr class="hr-divider">
      </div>
      <div class="wallet-popup-content">
        <div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
            <path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z" fill="#666"/>
          </svg>
          Connected with MetaMask
        </div>
        <div class="wallet-address">${this.wallet.account}</div>
        <hr class="hr-divider">
        <div>Current Network</div>
        <div class="wallet-network">${networkName}</div>
        <hr class="hr-divider">
        <div class="wallet-popup-actions">
          <div class="wallet-popup-actions-row">
            <a href="https://${network.name === 'homestead' ? '' : network.name + '.'}etherscan.io/address/${this.wallet.account}" 
               target="_blank" 
               class="explorer-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 19H5V5H12V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V12H19V19ZM14 3V5H17.59L7.76 14.83L9.17 16.24L19 6.41V10H21V3H14Z" fill="currentColor"/>
              </svg>
              View on Explorer
            </a>
            <button class="copy-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
              </svg>
              Copy Address
            </button>
          </div>
          <button class="disconnect-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor"/>
            </svg>
            Disconnect Wallet
          </button>
        </div>
      </div>
    `;

    // Add popup to body
    document.body.appendChild(popup);
    this.popup = popup;

    // Add event listeners
    const closeBtn = popup.querySelector('.wallet-popup-close');
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(backdrop);
      document.body.removeChild(popup);
      this.popup = null;
    });

    backdrop.addEventListener('click', () => {
      document.body.removeChild(backdrop);
      document.body.removeChild(popup);
      this.popup = null;
    });

    // Add copy functionality
    const copyBtn = popup.querySelector('.copy-button');
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(this.wallet.account);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy Address';
      }, 2000);
    });

    // Add disconnect functionality
    const disconnectBtn = popup.querySelector('.disconnect-button');
    disconnectBtn.addEventListener('click', async () => {
      // Properly disconnect the wallet
      this.wallet.disconnect();
      this.isConnected = false;
      
      // Update button text
      this.updateButtonText();
      
      // Close the popup
      document.body.removeChild(backdrop);
      document.body.removeChild(popup);
      this.popup = null;
      
      // Emit disconnect event
      this.element.dispatchEvent(new CustomEvent('walletDisconnected'));
      
      // If there's a disconnect callback in options, call it
      if (this.options.onDisconnect) {
        this.options.onDisconnect();
      }
    });
  }

  mount(selector) {
    const container = document.querySelector(selector);
    if (container) {
      container.appendChild(this.createButton());
    } else {
      console.error(`Container ${selector} not found`);
    }
  }

  unmount() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    if (this.popup) {
      document.body.removeChild(this.popup);
      const backdrop = document.querySelector('.wallet-popup-backdrop');
      if (backdrop) {
        document.body.removeChild(backdrop);
      }
    }
  }

  async checkConnection() {
    if (!SUPPORTED_WALLETS.length) {
      console.warn('No wallets configured. Use WalletButton.configureSupportedWallets() to configure wallets.');
      return false;
    }

    // Try to detect connected wallet
    for (const wallet of SUPPORTED_WALLETS) {
      const provider = wallet.getProvider();
      if (provider) {
        try {
          const accounts = await provider.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            this.isConnected = true;
            await this.wallet.connect(wallet.id);
            this.updateButtonText();
            return true;
          }
        } catch (error) {
          console.warn(`Failed to check ${wallet.name} connection:`, error);
        }
      }
    }
    return false;
  }
}

// Export both classes
export { WalletConnector, WalletButton };
