export const Shibuya = {
    chainId: 81,
    chainName: 'Shibuya',
    isTestChain: false,
    isLocalChain: false,
    multicallAddress: '0x107C9d34A926e02B377b20Ba02cAe9564b8d8EAA',
    getExplorerAddressLink: (address) => `https://blockscout.com/shibuya/address/${address}`,
    getExplorerTransactionLink: (transactionHash) => `https://blockscout.com/shibuya/tx/${transactionHash}`,
}
