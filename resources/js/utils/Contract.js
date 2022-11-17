import Authentication from "../contracts/Authentication.sol/Authentication.json";

const Contract = async (web3) => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Authentication.networks[networkId];
    const ret = new web3.eth.Contract(
        Authentication.abi,
        deployedNetwork && deployedNetwork.address
    );

    return ret
}

export default Contract;