export const callToAction = {
    transfer: 'Transfer',
    stake: 'Stake',
    noAction: 'No Action',
    mint: 'Mint',
    claim: 'Claim',
    delegate: 'Delegate',
    vote: 'Vote',
  }

  // Substrate based chains call
  // transfer is the balance transfer keep alive action
//   const actionCalls = {
//     transfer:  api.tx.balances.transferKeepAlive,
//     stake: api.tx.staking.stake,
//     noAction: null,
//     mint: api.tx.balances.mint,
//     claim: api.tx.staking.claim,
//     delegate: api.tx.staking.delegate,
//     vote: api.tx.democracy.vote,
//   }

    // what we need to do is hard code some of the values and keep the rest dynamic for inputting by the user 
    // so for exammple transferKeepAlive has 3 parameters: AccountIdLookUpOf

//     const actionCallsData = {
//    transfer: {
//         method: "transferKeepAlive",
//         section: "balances",
//         arguments: [
//           {
//             Id: recipientId,
//           },
//           amountU128,
//         ]
//       },
//     stake: 
//       {
//         method: "bond",
//         section: "staking",
//         arguments: [
//             amountStakedU128,
//         {
//         "Account": AccountIdLookUpOf,
//         }
//   ]

//       },
//       delegate: {
//         method: "delegate",
//         section: "convictionVoting",
//         arguments: [
//           classU16, // input
//           {
//             Id: recipientId // input
//           },
//          convictionEnum, // input None, Locked1x, Locked2x, Locked3x, Locked4x, Locked5x, Locked6x
//           amountDelegatedU128 // input
//         ]
//       },
//      vote:
//         {
//         method: "vote",
//         section: "convictionVoting",
//         arguments: [
//             pollIndexU32, // input
//             {
//             vote: { // input Standard, Split, SplitAbstain 
//                 "vote": {
//                 "conviction": convictionEnum, // input None, Locked1x, Locked2x, Locked3x, Locked4x, Locked5x, Locked6x
//                 "vote": vote // Aye or Nay (bool) input
//                 },
//                 "balance": votingAmountU128 // input
//             }
//             }
//         ]
//         }
      
//     }

   export const actionConfigs = {
        transfer: {
          method: "transferKeepAlive",
          section: "balances",
          args: [
            { key: 'recipientId', type: 'AccountId', label: 'Recipient ID' },
            { key: 'amountU128', type: 'u128', label: 'Amount' }
          ]
        },
        stake: {
          method: "bond",
          section: "staking",
          args: [
            { key: 'amountStakedU128', type: 'u128', label: 'Amount Staked' },
            { key: 'AccountIdLookUpOf', type: 'AccountId', label: 'Account ID' }
          ]
        },
        delegate: {
          method: "delegate",
          section: "convictionVoting",
          args: [
            { key: 'classU16', type: 'u16', label: 'Class' },
            { key: 'recipientId', type: 'AccountId', label: 'Recipient ID' },
            { key: 'convictionEnum', type: 'enum', label: 'Conviction', options: ['None', 'Locked1x', 'Locked2x', 'Locked3x', 'Locked4x', 'Locked5x', 'Locked6x'] },
            { key: 'amountDelegatedU128', type: 'u128', label: 'Amount Delegated' }
          ]
        },
        vote: {
          method: "vote",
          section: "convictionVoting",
          args: [
            { key: 'pollIndexU32', type: 'u32', label: 'Poll Index' },
            { key: 'voteType', type: 'enum', label: 'Vote Type', options: ['Standard', 'Split', 'SplitAbstain'] },
            { key: 'conviction', type: 'enum', label: 'Conviction', options: ['None', 'Locked1x', 'Locked2x', 'Locked3x', 'Locked4x', 'Locked5x', 'Locked6x'] },
            { key: 'vote', type: 'bool', label: 'Vote', options: ['Aye', 'Nay'] },
            { key: 'votingAmountU128', type: 'u128', label: 'Voting Amount' }
          ]
        }
      };
      
      


    
