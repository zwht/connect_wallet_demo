import { GenSdk } from '@gen-io/gen-sdk';
const genSdk = new GenSdk()
const { api, swapSdk, config, web3, utils } = genSdk

async function init() {
   let req = await api.getGasPrice({
      chain: 'bsc'
   })
   console.log(req)

}
init()
