require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: './resources/js'
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    goerli: {
      url: "https://goerli.infura.io/v3/f5ab85cba2e3441e86162a1c50f2d65b",
      accounts: ["90d62e3b771944acabef387e0482c45b58db11b666c1e17e982c8ea62334023d"]
    }
  },
  etherscan: {
    apiKey : "2GEHPMP2SZP2FIF8ACK5GZYX64PEBFZEUT"
  }
};
