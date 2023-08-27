npx hardhat transfer-token \
  --network sepolia \
  --amount 100 \
  --sender "0xe10c5dc329BAC79F29F9c45Bc5DD5D43a12E3171" \
  --protocol "0x6e57a0a2AE23491B8Ca5C9d08C0B384e2bDBB925" \
  --destchain "mumbai"

# amount: We send only 100 "wei" units - i.e. 0.0000000000000001 CCIP-BnM tokens
# sender: Sender Contract Address on Sepolia
# protocol: Protocol Contract Address on Mumbai

#####
# TxHash: 0xa915006a8e7d4e79820daa3928f3cc2753965af767fa2f17d427977b426815e5
# https://ccip.chain.link/msg/0xd022fbdf13ec054cf5e8aac32fba83af7aa01af51cf2bcf7dfce536a69cc4c9f
# ~ 22 minutes to be Success
