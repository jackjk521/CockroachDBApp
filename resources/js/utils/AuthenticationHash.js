import SignData from './SignData';

const AuthenticationHash = async ( accountAddress, web3) => {
    let signedMessage = await SignData(accountAddress, web3);
    return await web3.eth.accounts.hashMessage(signedMessage);
}

export default AuthenticationHash;