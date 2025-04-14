import WalletConnector from '../index';

class WalletButton {
  constructor(options = {}) {
    this.options = {
      buttonText: 'Connect Wallet',
      connectedText: 'Connected',
      buttonClass: 'wallet-button',
      ...options
    };
    
    this.wallet = new WalletConnector();
    this.element = null;
    this.isConnected = false;
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
          button.textContent = this.options.connectedText;
          if (this.options.onConnect) {
            this.options.onConnect(this.wallet);
          }
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
  }

  // Helper method to check if wallet is connected
  async checkConnection() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      this.isConnected = accounts.length > 0;
      if (this.element) {
        this.element.textContent = this.isConnected ? this.options.connectedText : this.options.buttonText;
      }
      return this.isConnected;
    }
    return false;
  }
}

export default WalletButton;
