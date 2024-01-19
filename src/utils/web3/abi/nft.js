const abi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_mbdPriceAsset",
                type: "address",
            },
            { internalType: "address", name: "_bjxAddress", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "operator",
                type: "address",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "approved",
                type: "bool",
            },
        ],
        name: "ApprovalForAll",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        name: "Authorised",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "tokenAddress",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "toAddress",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "num",
                type: "uint256",
            },
        ],
        name: "Sold",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: false,
                internalType: "enum DouJi1155.VoteType",
                name: "voteType",
                type: "uint8",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "startTime",
                type: "uint256",
            },
        ],
        name: "StartVote",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "operator",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256[]",
                name: "ids",
                type: "uint256[]",
            },
            {
                indexed: false,
                internalType: "uint256[]",
                name: "values",
                type: "uint256[]",
            },
        ],
        name: "TransferBatch",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "operator",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "id",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "TransferSingle",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "string",
                name: "value",
                type: "string",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "id",
                type: "uint256",
            },
        ],
        name: "URI",
        type: "event",
    },
    {
        inputs: [],
        name: "allValue",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            { internalType: "address", name: "", type: "address" },
        ],
        name: "alreadyDiscounts",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "string", name: "_tokenURI", type: "string" },
            {
                internalType: "uint256",
                name: "_initialAmount",
                type: "uint256",
            },
            { internalType: "uint256", name: "_price", type: "uint256" },
            { internalType: "uint256", name: "_maxSupply", type: "uint256" },
        ],
        name: "authorise",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "account", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address[]", name: "accounts", type: "address[]" },
            { internalType: "uint256[]", name: "ids", type: "uint256[]" },
        ],
        name: "balanceOfBatch",
        outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "uint256", name: "value", type: "uint256" },
        ],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "cancelVote",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
            { internalType: "address", name: "_user", type: "address" },
        ],
        name: "checkAV",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "checkP_C",
        outputs: [
            { internalType: "bool", name: "", type: "bool" },
            { internalType: "bool", name: "", type: "bool" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "cycleLen",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "getC_P_D",
        outputs: [
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "uint256", name: "", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_owner", type: "address" }],
        name: "getCreaterData",
        outputs: [
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "uint256", name: "", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "getDaoRule",
        outputs: [{ internalType: "uint16", name: "", type: "uint16" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "getVotePromoter",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_address", type: "address" },
            {
                internalType: "enum DouJi1155.Role",
                name: "_role",
                type: "uint8",
            },
        ],
        name: "grant",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "account", type: "address" },
            { internalType: "address", name: "operator", type: "address" },
        ],
        name: "isApprovedForAll",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
        name: "lock",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "lockable",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "marketAddress",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_to", type: "address" },
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
            { internalType: "uint256", name: "_value", type: "uint256" },
            { internalType: "bytes", name: "_data", type: "bytes" },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "platformFee",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "pledgeAllBalanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "account", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "pledgeBalanceOf",
        outputs: [
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "uint256", name: "", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "tokenId", type: "uint256" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "pledgeNft",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "priceAsset",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "receivingAddress",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_address", type: "address" },
        ],
        name: "revoke",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256[]", name: "ids", type: "uint256[]" },
            { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
            { internalType: "bytes", name: "data", type: "bytes" },
        ],
        name: "safeBatchTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "uint256", name: "amount", type: "uint256" },
            { internalType: "bytes", name: "data", type: "bytes" },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "operator", type: "address" },
            { internalType: "bool", name: "approved", type: "bool" },
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "setCollectCount",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "setDaoRule",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_platformFee", type: "uint256" },
        ],
        name: "setFees",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "setNsp",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_operater", type: "address" },
            {
                internalType: "address",
                name: "_marketAddress",
                type: "address",
            },
        ],
        name: "setOperaterAndMarket",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "setPraiseCount",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_receivingAddress",
                type: "address",
            },
        ],
        name: "setRAddress",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "setReadDuration",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "setTokenPrice",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "setTokenURI",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
            { internalType: "uint256", name: "_value", type: "uint256" },
        ],
        name: "snapshot",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
            { internalType: "uint16", name: "daoFee", type: "uint16" },
            { internalType: "uint256", name: "mVoteCount", type: "uint256" },
        ],
        name: "startSetDaoRule",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
            { internalType: "bool", name: "isOpen", type: "bool" },
            {
                internalType: "enum DouJi1155.SPTType",
                name: "sptType",
                type: "uint8",
            },
            { internalType: "address", name: "_contract", type: "address" },
            { internalType: "uint256", name: "discounts", type: "uint256" },
            { internalType: "uint256", name: "discountsFee", type: "uint256" },
            { internalType: "uint256", name: "disTokenId", type: "uint256" },
        ],
        name: "startSetNsp",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
            { internalType: "uint256", name: "_price", type: "uint256" },
            {
                internalType: "uint256",
                name: "_availableSupply",
                type: "uint256",
            },
        ],
        name: "startSetTokenPrice",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
            { internalType: "string", name: "_tokenURI", type: "string" },
        ],
        name: "startSetTokenURI",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes4", name: "interfaceId", type: "bytes4" },
        ],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "tokenOwnerCount",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "tokenOwners",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "tokenSupply",
        outputs: [
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "uint256", name: "", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "tokens",
        outputs: [
            {
                components: [
                    {
                        internalType: "enum DouJi1155.TokenType",
                        name: "tokenType",
                        type: "uint8",
                    },
                    { internalType: "address", name: "asset", type: "address" },
                    { internalType: "uint256", name: "price", type: "uint256" },
                ],
                internalType: "struct DouJi1155.Price",
                name: "price",
                type: "tuple",
            },
            { internalType: "uint256", name: "currentSupply", type: "uint256" },
            { internalType: "uint256", name: "maxSupply", type: "uint256" },
            {
                internalType: "uint256",
                name: "availableSupply",
                type: "uint256",
            },
            {
                components: [
                    { internalType: "bool", name: "isOpen", type: "bool" },
                    {
                        internalType: "enum DouJi1155.SPTType",
                        name: "sptType",
                        type: "uint8",
                    },
                    {
                        internalType: "address",
                        name: "cAddress",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "discounts",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "discountsFee",
                        type: "uint256",
                    },
                ],
                internalType: "struct DouJi1155.Nsp",
                name: "nsp",
                type: "tuple",
            },
            { internalType: "uint16", name: "daoFee", type: "uint16" },
            { internalType: "uint256", name: "mVoteCount", type: "uint256" },
            {
                components: [
                    { internalType: "uint256", name: "no", type: "uint256" },
                    { internalType: "uint256", name: "count", type: "uint256" },
                    {
                        internalType: "uint256",
                        name: "startTime",
                        type: "uint256",
                    },
                    { internalType: "string", name: "uri", type: "string" },
                    {
                        internalType: "enum DouJi1155.VoteType",
                        name: "voteType",
                        type: "uint8",
                    },
                    {
                        internalType: "address",
                        name: "promoter",
                        type: "address",
                    },
                    {
                        components: [
                            {
                                components: [
                                    {
                                        internalType:
                                            "enum DouJi1155.TokenType",
                                        name: "tokenType",
                                        type: "uint8",
                                    },
                                    {
                                        internalType: "address",
                                        name: "asset",
                                        type: "address",
                                    },
                                    {
                                        internalType: "uint256",
                                        name: "price",
                                        type: "uint256",
                                    },
                                ],
                                internalType: "struct DouJi1155.Price",
                                name: "price",
                                type: "tuple",
                            },
                            {
                                internalType: "uint256",
                                name: "currentSupply",
                                type: "uint256",
                            },
                            {
                                internalType: "uint256",
                                name: "maxSupply",
                                type: "uint256",
                            },
                            {
                                internalType: "uint256",
                                name: "availableSupply",
                                type: "uint256",
                            },
                            {
                                components: [
                                    {
                                        internalType: "bool",
                                        name: "isOpen",
                                        type: "bool",
                                    },
                                    {
                                        internalType: "enum DouJi1155.SPTType",
                                        name: "sptType",
                                        type: "uint8",
                                    },
                                    {
                                        internalType: "address",
                                        name: "cAddress",
                                        type: "address",
                                    },
                                    {
                                        internalType: "uint256",
                                        name: "tokenId",
                                        type: "uint256",
                                    },
                                    {
                                        internalType: "uint256",
                                        name: "discounts",
                                        type: "uint256",
                                    },
                                    {
                                        internalType: "uint256",
                                        name: "discountsFee",
                                        type: "uint256",
                                    },
                                ],
                                internalType: "struct DouJi1155.Nsp",
                                name: "nsp",
                                type: "tuple",
                            },
                            {
                                internalType: "uint16",
                                name: "daoFee",
                                type: "uint16",
                            },
                            {
                                internalType: "uint256",
                                name: "mVoteCount",
                                type: "uint256",
                            },
                        ],
                        internalType: "struct DouJi1155.TmpToken",
                        name: "tmpToken",
                        type: "tuple",
                    },
                ],
                internalType: "struct DouJi1155.Vote",
                name: "vote",
                type: "tuple",
            },
            { internalType: "bool", name: "isVoting", type: "bool" },
            { internalType: "uint256", name: "readDuration", type: "uint256" },
            { internalType: "uint256", name: "collectCount", type: "uint256" },
            { internalType: "uint256", name: "praiseCount", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
            {
                internalType: "address",
                name: "_newOwnerAddress",
                type: "address",
            },
        ],
        name: "transferTokenOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "tokenId", type: "uint256" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "unPledgeNft",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
        name: "unlock",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
        name: "uri",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "voteByBallot",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "voteCount",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
]
export default { abi }
