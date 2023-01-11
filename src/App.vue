<template>
  <div id="app">
    <div style="height: 50px;">{{address}}</div>
    <div style="height: 50px;">{{chainId}}</div>

    <button @click="connectWalletNear('NearWallet','near')">connectWalletNear</button>
    <button @click="addNetwork('eth')">eth</button>
    <button @click="addNetwork('polygon')">polygon</button>
    <button @click="addNetwork('bsc')">bsc</button>
    <button @click="addNetwork('fantom')">'fantom'</button>
  </div>
</template>

<script>
import Web3 from "web3";
import Vue from 'vue'

import { OpenoceanSdk } from '@openocean.finance/openocean-sdk';
const openoceanSdk = new OpenoceanSdk()
const { swapSdk } = openoceanSdk

import VConsole from 'vconsole'
const vConsole = new VConsole()
Vue.use(vConsole)
console.info("vconsole测试")
console.info(window)


let chainObj = {
  "eth": {
    chainName: "Ethereum Mainnet",
    chainId: 1,
    blockExplorerUrl: "https://etherscan.io/tx/",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18, address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" },
    popularToken: ["ETH", "USDT", "USDC", "BUSD", "UNI", "C98", "LINK", "MATIC"],
    rpcUrls: [
      "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    ],
    compiler: 'EVM'
  },
  "ropsten": {
    chainName: "Ethereum Ropsten",
    chainId: 3,
    blockExplorerUrl: "https://ropsten.etherscan.io/",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18, address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" },
    popularToken: ["ETH", "USDT", "USDC", "BUSD", "UNI", "C98", "LINK", "MATIC"],
    rpcUrls: [
      "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    ],
    compiler: 'EVM',
    isTest: true
  },
  "rinkeby": {
    chainName: "Ethereum Rinkeby",
    chainId: 4,
    blockExplorerUrl: "https://rinkeby.etherscan.io/",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18, address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" },
    popularToken: ["ETH", "USDT", "USDC", "BUSD", "UNI", "C98", "LINK", "MATIC"],
    rpcUrls: [
      "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    ],
    compiler: 'EVM',
    isTest: true
  },
  "bsc": {
    chainName: "Binance Smart Chain", chainId: 56, blockExplorerUrl: "https://bscscan.com/tx/",
    popularToken: ["BNB", "USDT", "BUSD", "CAKE", "C98", "BAKE", "MBOX"],
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18, address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" },
    rpcUrls: ["https://bsc-dataseed1.binance.org/"],
    compiler: 'EVM',

  },
  "solana": {
    compiler: 'SOL',
    chainName: "Solana Mainnet", blockExplorerUrl: "https://solscan.io/tx/", popularToken: ["SOL", "SNY", "USDT", "USDC", "RAY", "STEP"], rpcUrls: null
  },
  "flow": {
    compiler: 'FLOW',
    chainName: "Flow Mainnet", blockExplorerUrl: "https://flowscan.org/transaction/", popularToken: ["SOL", "SNY", "USDT", "USDC", "RAY", "STEP"], rpcUrls: null
  },
  "polygon": {
    compiler: 'EVM',
    chainName: "Polygon Mainnet", chainId: 137, blockExplorerUrl: "https://polygonscan.com/tx/", popularToken: ["USDT", "USDC", "MATIC", "AAVE", "DINO", "ADDY", "MIMATIC"], nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18, address: "0x0000000000000000000000000000000000001010" }, rpcUrls: ["https://rpc-mainnet.maticvigil.com"]
  },
  "avax": {
    compiler: 'EVM',
    chainName: "Avalanche", chainId: 43114, blockExplorerUrl: "https://cchain.explorer.avax.network/tx/", popularToken: ["AVAX", "PNG", "DAI.E", "ETH", "WAVAX", "JOE", "QI", "USDC.E"], nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18, address: "0x0000000000000000000000000000000000000000" }, rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"]
  },
  "fantom": {
    compiler: 'EVM',
    chainName: "Fantom", chainId: 250, blockExplorerUrl: "https://ftmscan.com/tx/", popularToken: ["ETH", "USDT", "USDC", "SPIRIT", "1INCH", "C98", "FTM", "fUSDT", "MIM", "BOO"], nativeCurrency: { name: "FTM", symbol: "FTM", decimals: 18, address: "0x0000000000000000000000000000000000000000" }, rpcUrls: ["https://rpcapi.fantom.network"]
  },
  "arbitrum": {
    compiler: 'EVM',
    chainName: "Arbitrum", chainId: 42161, blockExplorerUrl: "https://arbiscan.io/tx/", nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18, address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" }, rpcUrls: ["https://arb1.arbitrum.io/rpc"]
  },
  "terra": {
    compiler: 'TERRA',
    chainName: "Terra Mainnet", blockExplorerUrl: "https://finder.terra.money/columbus-5/tx/", rpcUrls: null
  },
  "xdai": {
    compiler: 'EVM',
    chainName: "Gnosis Mainnet",
    chainId: 100,
    blockExplorerUrl: "https://blockscout.com/poa/xdai/tx/", popularToken: ["ETH", "USDT", "USDC", "BUSD", "1INCH", "C98"],
    nativeCurrency: { name: "xDai", symbol: "XDAI", decimals: 18, address: "0x0000000000000000000000000000000000000000" },
    rpcUrls: ["https://rpc.gnosischain.com", "https://rpc.xdaichain.com/"]
  },
  "boba": {
    compiler: 'EVM',
    chainName: "Boba Mainnet", chainId: 288, blockExplorerUrl: "https://blockexplorer.boba.network/tx/", nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18, address: "0x0000000000000000000000000000000000000000" }, rpcUrls: ["https://mainnet.boba.network"]
  },
  "ont": {
    compiler: 'ONT',
    chainName: "Ontology Mainnet", blockExplorerUrl: "https://explorer.ont.io/transaction/", popularToken: [], rpcUrls: null
  },
  "ontevm": {
    compiler: 'EVM',
    chainName: "Ontology Evm", chainId: 58, blockExplorerUrl: "https://explorer.ont.io/transaction/", nativeCurrency: { name: "ONG", symbol: "ONG", decimals: 18, address: "0x0000000000000000000000000000000000000000" }, rpcUrls: ["https://dappnode10.ont.io:10339"]
  },
  "tron": {
    compiler: 'TRON',
    chainName: "Tron Mainnet",
    blockExplorerUrl: "https://tronscan.io/#/transaction/",
    popularToken: ["TRX", "WTRX", "ETH", "BTC", "USDT", "USDJ", "JST"],
    rpcUrls: null
  },
  "heco": {
    compiler: 'EVM',
    chainName: "Heco Mainnet",
    chainId: 128,
    blockExplorerUrl: "https://http-mainnet.hecochain.com/tx/",
    popularToken: ["HT", "ETH", "AAVE", "USDT", "USDC", "MDX", "DEP"],
    nativeCurrency: { name: "HT", symbol: "HT", decimals: 18, address: "0x0000000000000000000000000000000000000000" },
    rpcUrls: ["https://http-mainnet.hecochain.com"]
  },
  "okex": {
    compiler: 'EVM',
    chainName: "OEC Mainnet", chainId: 66, blockExplorerUrl: "https://www.oklink.com/okexchain/", popularToken: ["OKT", "OKB", "USDT", "USDC", "BUSD", "BNB", "CHE"], nativeCurrency: { name: "OKT", symbol: "OKT", decimals: 18, address: "0x0000000000000000000000000000000000000000" }, rpcUrls: ["https://exchainrpc.okex.org"]
  },
  "optimism": {
    compiler: 'EVM',
    chainName: "Optimism",
    chainId: 10,
    blockExplorerUrl: "https://optimism.io/tx/",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18, address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" },
    rpcUrls: ["https://rpc.ankr.com/optimism", "https://optimism-mainnet.public.blastapi.io", "https://mainnet.optimism.io"]
  },
  "harmony": {
    compiler: 'EVM',
    chainName: "Harmony",
    chainId: 1666600000,
    blockExplorerUrl: "https://explorer.harmony.one/",
    nativeCurrency: { name: "ONE", symbol: "ONE", decimals: 18, address: "0x0000000000000000000000000000000000000000" },
    popularToken: ["ETH", "USDT", "USDC", "BUSD", "1INCH", "C98"],
    rpcUrls: ["https://api.s0.t.hmny.io", "https://api.harmony.one"]
  },
  "dot": {
    compiler: 'EVM',
    chainName: "Polkadot", blockExplorerUrl: "", popularToken: ["ETH", "USDT", "USDC", "BUSD", "1INCH", "C98"]
  },
  "neo": {
    compiler: 'EVM',
    chainName: "Neo", blockExplorerUrl: "", popularToken: ["ETH", "USDT", "USDC", "BUSD", "1INCH", "C98"]
  },
  "aurora": {
    chainName: "Aurora Mainnet",
    chainId: 1313161554,
    blockExplorerUrl: "https://aurorascan.dev/tx/",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18, address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" },
    popularToken: [],
    rpcUrls: [
      "https://mainnet.aurora.dev"
    ],
    compiler: 'EVM'
  },
  "cronos": {
    chainName: "Cronos Mainnet",
    chainId: 25,
    blockExplorerUrl: "https://cronos.org/explorer",
    nativeCurrency: {
      name: "CRO",
      symbol: "CRO",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000"
    },
    popularToken: [],
    rpcUrls: [
      "https://evm.cronos.org"
    ],
    compiler: 'EVM'
  },
  "moonriver": {
    chainName: "Moonriver Mainnet",
    chainId: 1285,
    blockExplorerUrl: "https://moonriver.moonscan.io",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18, address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" },
    popularToken: [],
    rpcUrls: [
      "https://rpc.moonriver.moonbeam.network"
    ],
    compiler: 'EVM'
  },
  "bsctest": {
    chainName: "BSC Test Network",
    chainId: 1285,
    blockExplorerUrl: "https://testnet.bscscan.com/",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18, address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" },
    popularToken: [],
    rpcUrls: [
      "https://data-seed-prebsc-1-s1.binance.org:8545"
    ],
    compiler: 'EVM'
  },
  "aptos": {
    compiler: 'APTOS',
    chainName: "Aptos Mainnet",
    blockExplorerUrl: "https://explorer.aptoslabs.com/txn/",
    nativeCurrency: { name: "Aptos", symbol: "APT", decimals: 8, address: "0x1" },
  },
  "near": {
    compiler: 'NEAR',
    chainName: "Near Mainnet",
    blockExplorerUrl: "https://nearblocks.io/txns/",
    nativeCurrency: { name: "Near", symbol: "Near", decimals: 24, address: "near.near" },
  }
}


export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      address: null,
      chainId: '',
      wallet: {
        sdk: {},
        address: ''
      },
    }
  },
  async created () {

  },
  methods: {
    async connectWalletNear (walletName, chain) {
      try {
        let bb = {
          chain: chain,
          walletName: walletName
        }

        let data = await swapSdk.connectWallet(bb)
        console.log('链接成功')
        if (data) {
          let wallet = this.wallet = data.wallet
          this.chain = data.chain
          console.log('old', this.wallet.sdk)
          let account = this.wallet.sdk.account()
          let sdd = await this.wallet.sdk._connectedAccount.getAccountBalance()
          console.log('地址' + this.wallet.address)
        }
      } catch (error) {
        console.log('错误')
        console.log(error)
        this.wallet = null
        this.chain = null
      }
    },
    async addNetwork (chainId) {
      let chain_info = chainObj[chainId];
      try {
        if (!(window.ethereum || (Web3 && Web3.givenProvider) || window.safepal_wallet_app)) {
          throw new Error('chainId', chainId);
        }
        this.sdk = new Web3(Web3.givenProvider || window.ethereum || window.safepal_wallet_app)
        // this.sdk = new Web3(window.ethereum);
        const [address] = await this.sdk.eth.requestAccounts();
        const currentChainId = await this.sdk.eth.getChainId();
        if (chainId && currentChainId !== chainId) {
          throw new Error('EnumErrors.ChainIdNotMath');
        }
        this.address = address;
        this.chainId = currentChainId;
      } catch (error) {
        const { message } = error;
        if (message === "40006") {
          try {
            await this.web3.currentProvider.request({
              method: 'wallet_switchEthereumChain',
              params: [{
                chainId: this.web3.utils.numberToHex(chain_info.chainId),
              }],
            });
            this.addNetwork(chainId)
          } catch (switchError) {
            debugger
            if (switchError.code === 4902) {
              await this.web3.currentProvider.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: this.web3.utils.numberToHex(chain_info.chainId),
                    chainName: chain_info.chainName,
                    rpcUrls: chain_info.rpcUrls,
                    blockExplorerUrls: chain_info.blockExplorerUrls,
                    nativeCurrency: chain_info.nativeCurrency
                  },
                ],
              });
              this.addNetwork(chainId)
            }
          }
        }
      }
    }
  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
