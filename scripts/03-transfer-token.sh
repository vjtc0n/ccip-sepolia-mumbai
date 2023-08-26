npx hardhat transfer-token \
  --network sepolia \
  --amount 100 \
  --sender "0xe10c5dc329BAC79F29F9c45Bc5DD5D43a12E3171" \
  --protocol "0xfa795B92B655c030612EfA34bB57602d985Ce814" \
  --destchain "mumbai"

# amount: We send only 100 "wei" units - i.e. 0.0000000000000001 CCIP-BnM tokens
# sender: Sender Contract Address on Sepolia
# protocol: Protocol Contract Address on Mumbai

#####
# TxHash: 0xe8f19ff3ad2d4b91628100be8142c842230f30053ba4874ad78db7e19ba50bb1
# https://ccip.chain.link/msg/0x9e6539a160df7f76d65267dee0dc744f1b1931f084650ba8e75524d5abea98ee
# ~ 22 minutes to be Success
