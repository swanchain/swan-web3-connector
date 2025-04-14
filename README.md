# Swan Web3 Connector

A universal Web3 wallet connector for Vue and React applications with a user-friendly interface. This connector provides a seamless way to interact with Web3 wallets like MetaMask in your dApp.

## Features

- 🔌 Easy wallet connection
- 🎨 Beautiful UI components
- 🔄 Automatic chain switching and adding
- ✍️ Message signing support
- 👀 Account and chain change event listeners
- 🔗 Universal compatibility (Vue and React)
- 🛡️ User-friendly error handling
- 🎯 Customizable button component
- 💫 Real-time balance updates
- 🔍 Block explorer integration

## Installation

```bash
npm install swan-web3-connector ethers
```

## Usage

### Basic Usage

```javascript
import { WalletButton } from 'swan-web3-connector';

// Create and mount the button
const walletButton = new WalletButton({
  buttonText: 'Connect Wallet',
  buttonClass: 'my-wallet-button',
  onConnect: (wallet) => {
    console.log('Connected account:', wallet.account);
    console.log('Chain ID:', wallet.chainId);
    console.log('Balance:', wallet.balance);
  },
  onError: (error) => {
    console.error('Connection error:', error);
  }
});

// Mount the button to a container
walletButton.mount('#wallet-container');
```

### Advanced Usage

```javascript
import { WalletConnector } from 'swan-web3-connector';

// Create a wallet connector instance
const wallet = new WalletConnector();

// Connect to wallet
async function connectWallet() {
  try {
    const connection = await wallet.connect();
    console.log('Connected account:', connection.account);
    console.log('Current chain ID:', connection.chainId);
    console.log('Balance:', connection.balance);
  } catch (error) {
    console.error('Connection error:', error);
  }
}

// Switch or add chain
const chainInfo = {
  chainId: '0x89', // Polygon Mainnet
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
  },
  rpcUrls: ['https://polygon-rpc.com'],
  blockExplorerUrls: ['https://polygonscan.com']
};

async function switchChain() {
  try {
    await wallet.checkAndSwitchChain(chainInfo);
  } catch (error) {
    console.error('Chain switch error:', error);
  }
}

// Sign a message
async function signMessage() {
  try {
    const signature = await wallet.signMessage('Hello, Web3!');
    console.log('Signature:', signature);
  } catch (error) {
    console.error('Signing error:', error);
  }
}

// Listen to account changes
wallet.on('accountChange', (account) => {
  console.log('Account changed:', account);
});

// Listen to chain changes
wallet.on('chainChange', (chainId) => {
  console.log('Chain changed:', chainId);
});

// Disconnect
wallet.disconnect();
```

## Features in Detail

### Wallet Button Component
- Displays wallet balance and shortened address when connected
- Automatic updates on account/chain changes
- Customizable styling
- Built-in popup for wallet information

### Wallet Connector
- Seamless integration with MetaMask and other Web3 wallets
- Automatic balance updates
- Chain management (switching/adding)
- Message signing capabilities
- Event handling for account and chain changes

### User Interface
- Clean and modern design
- Responsive layout
- Clear error messages
- Loading states
- Copy to clipboard functionality
- Block explorer links

## Requirements

- A Web3 wallet (like MetaMask) installed in the browser
- ethers.js v6.0.0 or higher

## Browser Support

- Chrome/Chromium (Latest 2 versions)
- Firefox (Latest 2 versions)
- Safari (Latest 2 versions)
- Edge (Latest 2 versions)

# Best Practice 
- Clone the repo
- Run ```python3 -m http.server 8000```
- See ```test.html```

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

MIT

## Support

For support, please open an issue in the GitHub repository or contact our support team.
