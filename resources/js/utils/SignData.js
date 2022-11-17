const SignData = async (accountAddress, web3) => {
    let signedData;
    const addy = web3.utils.toChecksumAddress(accountAddress)

    console.log(addy)

    await web3.eth.personal.sign(
        `Register`,
        addy,
        (err, signature) => {
            if (err) {
                signedData = err;
            } else {
                signedData = web3.eth.accounts.hashMessage(signature);
            }
        }
    );

    return signedData;
}

export default SignData;