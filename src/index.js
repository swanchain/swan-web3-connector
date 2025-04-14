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
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    min-width: 300px;
  }
  .wallet-popup-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
  .wallet-popup-header {
    margin-bottom: 15px;
  }
  .wallet-popup-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .wallet-popup-close {
    cursor: pointer;
    font-size: 20px;
    color: #666;
  }
  .wallet-popup-content {
    margin-bottom: 15px;
  }
  .wallet-address {
    background: #f5f5f5;
    padding: 10px;
    border-radius: 6px;
    font-family: monospace;
    margin: 10px 0;
    word-break: break-all;
  }
  .wallet-network {
    background: #e8f5e9;
    padding: 8px 12px;
    border-radius: 6px;
    display: inline-block;
    margin: 10px 0;
  }
  .copy-button {
    background: #2196F3;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }
  .copy-button:hover {
    background: #1976D2;
  }
  .explorer-link {
    color: #2196F3;
    text-decoration: none;
    margin-right: 15px;
  }
  .explorer-link:hover {
    text-decoration: underline;
  }
  .wallet-balance {
    background: #3F7233;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 500;
  }
  .wallet-address-text {
    background: #3F7233;
    padding: 4px 8px;
    border-radius: 4px;
    font-family: monospace;
  }
  .wallet-divider {
    width: 1px;
    height: 20px;
    background: rgba(0, 0, 0, 0.1);
    margin: 0 10px;
  }
  .hr-divider {
    border: none;
    border-top: 1px solid #ddd;
    width: 100%;
    margin: 10px 0;
  }
`;
document.head.appendChild(style);

class WalletConnector {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.account = null;
    this.chainId = null;
    this.balance = null;
    this.onAccountChange = null;
    this.onChainChange = null;
  }

  async connect() {
    try {
      if (window.ethereum) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        this.account = await this.signer.getAddress();
        this.chainId = (await this.provider.getNetwork()).chainId;
        await this.updateBalance();

        // Set up event listeners
        window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
        window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));

        return {
          account: this.account,
          chainId: this.chainId,
          balance: this.balance,
          provider: this.provider,
          signer: this.signer
        };
      } else {
        throw new Error('No Ethereum provider found. Please install MetaMask or another Web3 wallet.');
      }
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

  disconnect() {
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
    }
    this.provider = null;
    this.signer = null;
    this.account = null;
    this.chainId = null;
  }
}

class WalletButton {
  constructor(options = {}) {
    this.options = {
      buttonText: 'Connect Wallet',
      buttonClass: 'wallet-button',
      ...options
    };
    
    this.wallet = new WalletConnector();
    this.element = null;
    this.isConnected = false;
    this.popup = null;
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
        <span class="wallet-balance">${this.formatBalance(this.wallet.balance)}</span>
        <span class="wallet-divider"></span>
        <span class="wallet-address-text">${this.formatAddress(this.wallet.account)}</span>
      `;
      this.element.style.display = 'flex';
      this.element.style.alignItems = 'center';
      this.element.style.justifyContent = 'center';
      this.element.style.padding = '8px 16px';
    } else if (this.element) {
      this.element.textContent = this.options.buttonText;
    }
  }

  createButton() {
    const button = document.createElement('button');
    button.className = this.options.buttonClass;
    button.textContent = this.options.buttonText;
    
    button.addEventListener('click', async () => {
      try {
        if (!this.isConnected) {
          await this.wallet.connect();
          this.isConnected = true;
          this.updateButtonText();
          if (this.options.onConnect) {
            this.options.onConnect(this.wallet);
          }
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
          <h3 style="margin: 0;">Account</h3>
          <span class="wallet-popup-close">&times;</span>
        </div>
        <hr class="hr-divider">
      </div>
      <div class="wallet-popup-content">
        <div>Connected with MetaMask</div>
        <div class="wallet-address">${this.wallet.account}</div>
        <hr class="hr-divider">
        <div>Current Chain: </div>
        <div class="wallet-network">${networkName}</div>
        <hr class="hr-divider">
        <div style="margin-top: 15px;">
          <a href="https://${network.name === 'homestead' ? '' : network.name + '.'}etherscan.io/address/${this.wallet.account}" 
             target="_blank" 
             class="explorer-link">
            View on explorer
          </a>
          <button class="copy-button">Copy Address</button>
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
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      this.isConnected = accounts.length > 0;
      if (this.isConnected) {
        await this.wallet.connect(); // Initialize wallet if already connected
        this.updateButtonText();
      }
      return this.isConnected;
    }
    return false;
  }
}

// Export both classes
export { WalletConnector, WalletButton };
