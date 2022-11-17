import SignData from './SignData';

const AuthValidation = async ( accountAddress, web3, contract) => {

    let userAddress = await contract.methods.getUserAddress().call({ from: accountAddress });

    if (userAddress.toLowerCase() !== accountAddress.toLowerCase()) {
        return false;
    } else {
        let signedData = await SignData( accountAddress, web3);
        let hash = await web3.eth.accounts.hashMessage(signedData);
        let hashFromContract = await contract.methods.getSignatureHash().call({ from: accountAddress });

        return (hash === hashFromContract)? true : false
    }
}

export default AuthValidation;