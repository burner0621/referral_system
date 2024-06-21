// Support truffle-style test setup
require("@nomicfoundation/hardhat-toolbox");
require('@nomiclabs/hardhat-truffle5');
require('dotenv').config();

// Importing babel to be able to use ES6 imports
require('@babel/register')({
  presets: [
    ['@babel/preset-env', {
      'targets': {
        'node': '16',
      },
    }],
  ],
  only: [/test|scripts/],
  retainLines: true,
});
require('@babel/polyfill');

// Config from environment
const mnemonicPhrase = process.env.MNEMONIC || 'test test test test test test test test test test test junk';
const mnemonicPassword = process.env.MNEMONIC_PASSWORD;
const privateKey = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 15000,
          },
        },
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: '0.8.20',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ]
  },
  networks: {
    hardhat: {},
    localhost: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
    },
    sepolia: {
      url: 'https://ethereum-sepolia.publicnode.com',
      accounts: [privateKey],
      chainId: 11155111,
      gasPrice: 100000000000,
      // network_id: '*',
    },
    base: {
      url: 'https://base-rpc.publicnode.com',
      accounts: [privateKey],
      chainId: 8453,
      gasPrice: 2000000000,
    }
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 100000000,
  },
  etherscan: {
    apiKey: {
      sepolia: "3TEWVV2EK19S1Y6SV8EECZAGQ7W3362RCN",
      base: "21QBD7X75X222SSSTADIT6W9HWY92JCQ8M",
    },
    customChains: [
      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://api-sepolia.etherscan.io/api/",
          browserURL: "https://sepolia.etherscan.io/"
        }
      },
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org/"
        }
      }
    ]
  },
};
