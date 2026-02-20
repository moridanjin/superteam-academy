import type { Course } from "./types";

export const MOCK_COURSES: Course[] = [
  {
    id: 1,
    title: "Solana Fundamentals",
    slug: "solana-fundamentals",
    description:
      "Master the core concepts of Solana — accounts, transactions, programs, and the runtime model. Build a solid foundation for everything that follows.",
    difficulty: "beginner",
    duration: 8,
    thumbnailUrl: null,
    track: "Solana Fundamentals",
    xpReward: 500,
    modules: [
      {
        id: 1,
        title: "Introduction to Solana",
        order: 1,
        lessons: [
          {
            id: 1,
            title: "What is Solana?",
            type: "content",
            content: `# What is Solana?

Solana is a high-performance blockchain designed for decentralized applications and crypto-currencies. It can process thousands of transactions per second with sub-second finality.

## Key Features

- **Proof of History (PoH)** — a cryptographic clock that orders transactions before consensus
- **Tower BFT** — a PoH-optimized version of PBFT consensus
- **Turbine** — block propagation protocol inspired by BitTorrent
- **Gulf Stream** — mempool-less transaction forwarding
- **Sealevel** — parallel smart contract runtime
- **Pipeline** — transaction processing unit for validation optimization

## Why Solana?

Solana was built to solve the blockchain trilemma — achieving **scalability**, **security**, and **decentralization** simultaneously.

| Feature | Solana | Ethereum |
|---------|--------|----------|
| TPS | ~65,000 | ~15-30 |
| Block time | 400ms | 12s |
| Tx cost | ~$0.00025 | $1-50+ |
| Finality | ~400ms | ~15min |

## The Solana Runtime

Programs on Solana are stateless — they read and write data to **accounts**. Think of accounts as files in a filesystem that programs can modify.

\`\`\`rust
// Every account has these fields
pub struct AccountInfo {
    pub key: Pubkey,           // 32-byte address
    pub lamports: u64,         // Balance in lamports (1 SOL = 1B lamports)
    pub data: Vec<u8>,         // Arbitrary data storage
    pub owner: Pubkey,         // Program that owns this account
    pub executable: bool,      // Is this account a program?
    pub rent_epoch: u64,       // Epoch at which rent is due
}
\`\`\`

## What You'll Build

By the end of this course, you'll understand:

1. How accounts, transactions, and programs work together
2. How to derive addresses deterministically with PDAs
3. How to compose programs using Cross-Program Invocations
4. How to create and manage tokens on Solana`,
            order: 1,
            xpReward: 25,
            challenge: null,
          },
          {
            id: 2,
            title: "The Account Model",
            type: "content",
            content: `# The Account Model

Everything on Solana is an **account**. Programs, wallets, tokens, data — all stored in accounts. Understanding the account model is the foundation of Solana development.

## Account Structure

Every account on Solana has the following fields:

\`\`\`typescript
interface Account {
  key: PublicKey;        // Unique 32-byte address
  lamports: number;      // Balance (1 SOL = 1,000,000,000 lamports)
  data: Uint8Array;      // Raw byte data
  owner: PublicKey;      // Program that controls this account
  executable: boolean;   // Whether this is a program
  rentEpoch: number;     // Rent tracking
}
\`\`\`

## Account Ownership

A critical rule: **only the owner program can modify an account's data**. The System Program owns all wallet accounts. When you create a custom account, your program becomes its owner.

\`\`\`
┌─────────────────────────────────────────┐
│           System Program                │
│  Owner of all wallet/SOL accounts       │
│  Can: transfer SOL, create accounts     │
└─────────────────────────────────────────┘
        │ owns
        ▼
┌─────────────────────────────────────────┐
│        Your Wallet Account              │
│  key: 7xKX...3nPz                       │
│  lamports: 5_000_000_000 (5 SOL)        │
│  data: []                               │
│  owner: 11111111111111111111111111111111 │
└─────────────────────────────────────────┘
\`\`\`

## Rent

Accounts must maintain a minimum balance to stay alive. This is called **rent exemption**. The required balance depends on the account's data size:

\`\`\`typescript
// Approximate rent-exempt minimum
const rentExempt = await connection.getMinimumBalanceForRentExemption(
  dataSize // in bytes
);
// ~0.00089 SOL per byte per year
// Most accounts pay ~0.002 SOL for rent exemption
\`\`\`

> **Tip:** Always make accounts rent-exempt by depositing enough lamports at creation. Non-rent-exempt accounts get garbage collected.

## Account Types

| Type | Description | Owner |
|------|-------------|-------|
| Wallet | Holds SOL, no data | System Program |
| Program | Executable code | BPF Loader |
| Data | Custom program state | Your Program |
| Token | SPL token account | Token Program |
| PDA | Derived address, no private key | Your Program |

## Reading Accounts

You can read any account on Solana — accounts are public by default:

\`\`\`typescript
import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com");
const pubkey = new PublicKey("7xKX...3nPz");

const accountInfo = await connection.getAccountInfo(pubkey);
console.log("Balance:", accountInfo?.lamports);
console.log("Owner:", accountInfo?.owner.toBase58());
console.log("Data length:", accountInfo?.data.length);
\`\`\``,
            order: 2,
            xpReward: 25,
            challenge: null,
          },
          {
            id: 3,
            title: "Transactions & Instructions",
            type: "content",
            content: `# Transactions & Instructions

Transactions are the way you interact with Solana. Every state change — transferring SOL, creating accounts, calling programs — happens through a transaction.

## Anatomy of a Transaction

A transaction contains:

1. **Signatures** — one or more signatures from the required signers
2. **Message** — the actual payload containing instructions

\`\`\`typescript
interface Transaction {
  signatures: Signature[];
  message: {
    header: MessageHeader;
    accountKeys: PublicKey[];
    recentBlockhash: Blockhash;
    instructions: CompiledInstruction[];
  };
}
\`\`\`

## Instructions

Each instruction tells a specific program what to do:

\`\`\`typescript
interface TransactionInstruction {
  programId: PublicKey;    // Which program to call
  keys: AccountMeta[];     // Accounts the program needs
  data: Buffer;            // Serialized instruction data
}

interface AccountMeta {
  pubkey: PublicKey;
  isSigner: boolean;       // Must this account sign?
  isWritable: boolean;     // Will this account be modified?
}
\`\`\`

## Building a Transaction

Here's a complete example of transferring SOL:

\`\`\`typescript
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com");
const sender = Keypair.generate();
const receiver = Keypair.generate();

// Build the transfer instruction
const transferIx = SystemProgram.transfer({
  fromPubkey: sender.publicKey,
  toPubkey: receiver.publicKey,
  lamports: 0.1 * LAMPORTS_PER_SOL,
});

// Create transaction, add instruction, send
const tx = new Transaction().add(transferIx);
const sig = await sendAndConfirmTransaction(connection, tx, [sender]);
console.log("Transaction signature:", sig);
\`\`\`

## Multiple Instructions

Transactions can contain multiple instructions that execute **atomically** — either all succeed or all fail:

\`\`\`typescript
const tx = new Transaction()
  .add(createAccountIx)    // 1. Create a new account
  .add(initializeIx)       // 2. Initialize the account
  .add(transferIx);        // 3. Transfer tokens to it
// All three execute atomically
\`\`\`

## Transaction Limits

| Limit | Value |
|-------|-------|
| Max size | 1232 bytes |
| Max instructions | ~20 (depends on size) |
| Max accounts | 64 per transaction |
| Max compute units | 1,400,000 CU |
| Blockhash lifetime | ~60 seconds |

## Confirmation Levels

Solana offers different commitment levels:

- **processed** — transaction has been processed by the current node
- **confirmed** — transaction has been confirmed by a supermajority of the cluster
- **finalized** — transaction has been finalized (rooted) and is irreversible`,
            order: 3,
            xpReward: 25,
            challenge: null,
          },
          {
            id: 4,
            title: "Quiz: Solana Basics",
            type: "challenge",
            content: `# Quiz: Solana Basics

Test your understanding of the core Solana concepts covered in this module.

## Challenge

Complete the function below that creates a new account on Solana and transfers SOL to it.`,
            order: 4,
            xpReward: 50,
            challenge: {
              id: 1,
              prompt:
                "Create a function that generates a new keypair, requests an airdrop of 1 SOL, and transfers 0.1 SOL to a given recipient address.",
              starterCode: `import { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from "@solana/web3.js";

async function fundAndTransfer(recipientAddress: string): Promise<string> {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  // TODO: Generate a new keypair
  // TODO: Request airdrop of 1 SOL
  // TODO: Create transfer instruction for 0.1 SOL to recipient
  // TODO: Send and confirm the transaction
  // TODO: Return the transaction signature
}`,
              testCases:
                "1. Function returns a valid transaction signature\n2. Recipient receives 0.1 SOL\n3. Sender retains ~0.9 SOL (minus fees)",
              expectedOutput: "A base58-encoded transaction signature string",
              hints:
                "Use Keypair.generate() for the sender, connection.requestAirdrop() for the airdrop, and SystemProgram.transfer() for the transfer instruction.",
              solution: `import { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from "@solana/web3.js";

async function fundAndTransfer(recipientAddress: string): Promise<string> {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const sender = Keypair.generate();
  const recipient = new PublicKey(recipientAddress);

  const airdropSig = await connection.requestAirdrop(sender.publicKey, LAMPORTS_PER_SOL);
  await connection.confirmTransaction(airdropSig);

  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: recipient,
      lamports: 0.1 * LAMPORTS_PER_SOL,
    })
  );

  return await sendAndConfirmTransaction(connection, tx, [sender]);
}`,
            },
          },
        ],
      },
      {
        id: 2,
        title: "Programs & PDAs",
        order: 2,
        lessons: [
          {
            id: 5,
            title: "Program Derived Addresses",
            type: "content",
            content: `# Program Derived Addresses (PDAs)

PDAs are deterministic addresses derived from a program ID and a set of seeds. They don't have a corresponding private key, which means only the program can sign for them.

## Why PDAs?

PDAs solve a fundamental problem: **how does a program own and control accounts?**

Since PDAs have no private key, no external user can sign transactions that modify PDA-owned data. Only the program that derived the PDA can modify it.

## Deriving a PDA

\`\`\`typescript
import { PublicKey } from "@solana/web3.js";

const [pda, bump] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("user-profile"),           // Seed 1: a string
    userPublicKey.toBuffer(),              // Seed 2: a public key
  ],
  programId                                // The program's public key
);

console.log("PDA:", pda.toBase58());
console.log("Bump:", bump);  // 0-255, ensures the address is off the ed25519 curve
\`\`\`

## How It Works

The derivation process:

1. Hash the seeds + program ID + bump using SHA-256
2. Check if the result is on the ed25519 curve
3. If yes, decrement bump and retry (max bump = 255)
4. If no, we have a valid PDA (not a valid public key = no private key)

\`\`\`
Seeds: ["user-profile", <user_pubkey>]
Program: YourProgram111...

SHA-256(seeds + program_id + bump_255) → on curve? Yes → try bump_254
SHA-256(seeds + program_id + bump_254) → on curve? No → PDA found!

PDA = hash result
Canonical bump = 254
\`\`\`

> **Always store the canonical bump** to avoid recomputing it on every call.

## Common PDA Patterns

\`\`\`rust
// Singleton config
seeds = [b"config"]

// Per-user account
seeds = [b"profile", user.key().as_ref()]

// Per-user-per-entity
seeds = [b"enrollment", course_id.as_ref(), user.key().as_ref()]

// Sequential (counter-based)
seeds = [b"post", user.key().as_ref(), &post_count.to_le_bytes()]
\`\`\`

## PDAs as Signers

Programs can sign for PDAs in CPIs using \`invoke_signed\`:

\`\`\`rust
invoke_signed(
    &transfer_instruction,
    &[pda_account.clone(), destination.clone()],
    &[&[b"vault", &[bump]]],  // Seeds + bump to derive the PDA
)?;
\`\`\``,
            order: 1,
            xpReward: 25,
            challenge: null,
          },
          {
            id: 6,
            title: "Cross-Program Invocations",
            type: "content",
            content: `# Cross-Program Invocations (CPIs)

CPIs allow one program to call another program's instructions. This is how composability works on Solana — programs can build on top of each other.

## Basic CPI

\`\`\`rust
use solana_program::program::invoke;

// Call the System Program to transfer SOL
invoke(
    &system_instruction::transfer(
        from_account.key,
        to_account.key,
        amount,
    ),
    &[
        from_account.clone(),
        to_account.clone(),
        system_program.clone(),
    ],
)?;
\`\`\`

## CPI with PDA Signer

When a PDA needs to sign a CPI, use \`invoke_signed\`:

\`\`\`rust
use solana_program::program::invoke_signed;

// The vault PDA signs the transfer
invoke_signed(
    &system_instruction::transfer(
        vault_pda.key,
        recipient.key,
        withdraw_amount,
    ),
    &[
        vault_pda.clone(),
        recipient.clone(),
        system_program.clone(),
    ],
    // Signer seeds — must match the PDA derivation
    &[&[
        b"vault",
        authority.key.as_ref(),
        &[vault_bump],
    ]],
)?;
\`\`\`

## CPI Depth Limit

Solana allows CPIs up to **4 levels deep**:

\`\`\`
Program A → calls → Program B → calls → Program C → calls → Program D
    (1)              (2)              (3)              (4) ← max
\`\`\`

## Important Rules

1. **Reentrancy** — a program cannot CPI back into itself (prevents reentrancy attacks)
2. **Account privileges** — CPIs inherit signer and writable privileges from the caller
3. **Compute budget** — CPI calls share the parent transaction's compute budget
4. **Program ID validation** — always validate the CPI target program ID

\`\`\`rust
// Always validate the program you're calling
if token_program.key != &spl_token::ID {
    return Err(ProgramError::IncorrectProgramId);
}
\`\`\`

## Real-World CPI: Minting Tokens

\`\`\`rust
use anchor_spl::token::{self, MintTo};

// Mint tokens using a CPI to the Token Program
let cpi_accounts = MintTo {
    mint: ctx.accounts.mint.to_account_info(),
    to: ctx.accounts.token_account.to_account_info(),
    authority: ctx.accounts.mint_authority.to_account_info(),
};
let cpi_program = ctx.accounts.token_program.to_account_info();
let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

token::mint_to(cpi_ctx, amount)?;
\`\`\``,
            order: 2,
            xpReward: 25,
            challenge: null,
          },
          {
            id: 7,
            title: "Build a Counter Program",
            type: "challenge",
            content: `# Build a Counter Program

Time to write your first Solana program! You'll build a simple counter that can be incremented and decremented.

## Requirements

1. Initialize a counter account with a value of 0
2. Implement an \`increment\` instruction that adds 1
3. Implement a \`decrement\` instruction that subtracts 1 (minimum 0)
4. Use a PDA to store the counter state`,
            order: 3,
            xpReward: 75,
            challenge: {
              id: 2,
              prompt:
                "Write an Anchor program with initialize, increment, and decrement instructions for a counter stored in a PDA.",
              starterCode: `use anchor_lang::prelude::*;

declare_id!("CounterProgram111111111111111111111111111");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // TODO: Set counter value to 0
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        // TODO: Increment counter by 1
        Ok(())
    }

    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        // TODO: Decrement counter by 1 (min 0)
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    // TODO: Define accounts
}

#[derive(Accounts)]
pub struct Update<'info> {
    // TODO: Define accounts
}

#[account]
pub struct Counter {
    // TODO: Define counter state
}`,
              testCases:
                "1. Initialize sets counter to 0\n2. Increment increases counter by 1\n3. Decrement decreases counter by 1\n4. Decrement at 0 stays at 0",
              expectedOutput:
                "Counter initialized at 0, incremented to 1, decremented back to 0",
              hints:
                "Use #[account(init, pda, space)] for initialization. Store the bump in the Counter account. Use checked_sub for safe decrement.",
              solution: `use anchor_lang::prelude::*;

declare_id!("CounterProgram111111111111111111111111111");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.value = 0;
        counter.bump = ctx.bumps.counter;
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.value = counter.value.checked_add(1).unwrap();
        Ok(())
    }

    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.value = counter.value.saturating_sub(1);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        space = 8 + 8 + 1,
        seeds = [b"counter", user.key().as_ref()],
        bump
    )]
    pub counter: Account<'info, Counter>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [b"counter", user.key().as_ref()],
        bump = counter.bump,
    )]
    pub counter: Account<'info, Counter>,
}

#[account]
pub struct Counter {
    pub value: u64,
    pub bump: u8,
}`,
            },
          },
        ],
      },
      {
        id: 3,
        title: "Tokens on Solana",
        order: 3,
        lessons: [
          {
            id: 8,
            title: "SPL Token Standard",
            type: "content",
            content: `# SPL Token Standard

The SPL Token program is Solana's standard for fungible and non-fungible tokens. Unlike Ethereum's ERC-20 where each token deploys a new contract, Solana uses a **single program** for all tokens.

## Architecture

\`\`\`
┌─────────────────┐     ┌─────────────────┐
│   Mint Account  │     │  Token Account  │
│  (token config) │◄────│ (user balance)  │
│                 │     │                 │
│  supply: 1000   │     │  amount: 50     │
│  decimals: 9    │     │  owner: UserA   │
│  authority: X   │     │  mint: <Mint>   │
└─────────────────┘     └─────────────────┘
\`\`\`

## Creating a Token

\`\`\`typescript
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";

// 1. Create the mint (token definition)
const mint = await createMint(
  connection,
  payer,              // Who pays for the account
  mintAuthority,      // Who can mint new tokens
  freezeAuthority,    // Who can freeze accounts (null = no freeze)
  9                   // Decimals (9 = like SOL)
);

// 2. Create a token account for the user
const tokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  payer,
  mint,               // Which token
  owner.publicKey      // Whose token account
);

// 3. Mint tokens
await mintTo(
  connection,
  payer,
  mint,
  tokenAccount.address,
  mintAuthority,       // Must be the mint authority
  1_000_000_000       // 1 token (with 9 decimals)
);
\`\`\`

## Associated Token Accounts (ATAs)

Each wallet has a deterministic token account for each mint, called an **Associated Token Account**:

\`\`\`
ATA = PDA(wallet_address, TOKEN_PROGRAM_ID, mint_address)
\`\`\`

This means you can always find a user's token account without querying — just derive it.

## Key Concepts

- **Mint** — defines the token (supply, decimals, authorities)
- **Token Account** — holds a user's balance of a specific token
- **ATA** — deterministic token account per wallet per mint
- **Mint Authority** — can create new tokens
- **Freeze Authority** — can freeze token accounts`,
            order: 1,
            xpReward: 25,
            challenge: null,
          },
          {
            id: 9,
            title: "Token-2022 Extensions",
            type: "content",
            content: `# Token-2022 Extensions

Token-2022 (also called Token Extensions) is the next generation of the SPL Token program. It adds powerful extensions that enable new use cases without requiring custom programs.

## Key Extensions

### Transfer Fees
Charge a fee on every transfer — useful for protocol revenue:

\`\`\`typescript
const mint = await createMint(connection, payer, authority, null, 9, undefined, undefined, TOKEN_2022_PROGRAM_ID);
await initializeTransferFeeConfig(connection, mint, authority, authority, 50, 5000n); // 0.5% fee, max 5000 tokens
\`\`\`

### Non-Transferable (Soulbound)
Tokens that cannot be transferred — perfect for credentials and reputation:

\`\`\`rust
// In Superteam Academy, XP tokens use this extension
// Users earn XP but cannot transfer it to others
\`\`\`

### Permanent Delegate
A delegate that can never be removed — the program can always burn/transfer:

\`\`\`rust
// Combined with NonTransferable for XP tokens:
// - Users can't transfer (NonTransferable)
// - Platform can manage (PermanentDelegate)
\`\`\`

### Metadata Pointer + Token Metadata
Store metadata directly on the mint account — no separate Metaplex account needed:

\`\`\`typescript
// Point metadata to the mint itself
await initializeMetadataPointer(connection, mint, authority, mint);

// Store metadata on-chain
await initializeTokenMetadata(connection, mint, authority, mint, {
  name: "Superteam XP",
  symbol: "STXP",
  uri: "https://arweave.net/metadata.json",
});
\`\`\`

## Token-2022 vs Token Program

| Feature | Token | Token-2022 |
|---------|-------|------------|
| Transfer fees | No | Yes |
| Soulbound | No | Yes |
| On-chain metadata | No | Yes |
| Interest bearing | No | Yes |
| Confidential | No | Yes |
| CPI hook | No | Yes |

## Superteam Academy Uses Token-2022

The academy's XP system uses Token-2022 with:
- **NonTransferable** — XP can't be traded
- **PermanentDelegate** — platform manages supply
- **MetadataPointer** — metadata stored on mint`,
            order: 2,
            xpReward: 25,
            challenge: null,
          },
          {
            id: 10,
            title: "Create Your Own Token",
            type: "challenge",
            content: `# Create Your Own Token

Put your knowledge into practice! Create an SPL token with a mint, token accounts, and demonstrate minting and transferring.

## Requirements

1. Create a new mint with 6 decimals
2. Create token accounts for two users
3. Mint 1000 tokens to user A
4. Transfer 250 tokens from user A to user B`,
            order: 3,
            xpReward: 75,
            challenge: {
              id: 3,
              prompt:
                "Write a script that creates a mint, two token accounts, mints 1000 tokens, and transfers 250 from one account to another.",
              starterCode: `import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } from "@solana/spl-token";

async function createAndTransferToken() {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const payer = Keypair.generate();
  const userA = Keypair.generate();
  const userB = Keypair.generate();

  // Airdrop SOL to payer
  const sig = await connection.requestAirdrop(payer.publicKey, 2 * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(sig);

  // TODO: Create a mint with 6 decimals
  // TODO: Create token accounts for userA and userB
  // TODO: Mint 1000 tokens to userA
  // TODO: Transfer 250 tokens from userA to userB
}`,
              testCases:
                "1. Mint has 6 decimals\n2. User A has 750 tokens after transfer\n3. User B has 250 tokens after transfer",
              expectedOutput:
                "Mint created, user A balance: 750000000, user B balance: 250000000",
              hints:
                "Remember to account for decimals — 1000 tokens with 6 decimals = 1000 * 10^6 = 1_000_000_000. Use createMint, getOrCreateAssociatedTokenAccount, mintTo, and transfer from @solana/spl-token.",
              solution: `import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } from "@solana/spl-token";

async function createAndTransferToken() {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const payer = Keypair.generate();
  const userA = Keypair.generate();
  const userB = Keypair.generate();

  const sig = await connection.requestAirdrop(payer.publicKey, 2 * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(sig);

  const mint = await createMint(connection, payer, payer.publicKey, null, 6);

  const ataA = await getOrCreateAssociatedTokenAccount(connection, payer, mint, userA.publicKey);
  const ataB = await getOrCreateAssociatedTokenAccount(connection, payer, mint, userB.publicKey);

  await mintTo(connection, payer, mint, ataA.address, payer, 1_000_000_000);
  await transfer(connection, payer, ataA.address, ataB.address, userA, 250_000_000);
}`,
            },
          },
        ],
      },
    ],
    publishedAt: "2026-01-15T00:00:00.000Z",
  },
  {
    id: 2,
    title: "Anchor Framework Deep Dive",
    slug: "anchor-framework",
    description:
      "Learn the Anchor framework from scratch — macros, account validation, IDL generation, and testing. The fastest way to build Solana programs.",
    difficulty: "intermediate",
    duration: 12,
    thumbnailUrl: null,
    track: "Solana Fundamentals",
    xpReward: 800,
    modules: [
      {
        id: 4,
        title: "Anchor Basics",
        order: 1,
        lessons: [
          {
            id: 11,
            title: "Setting Up Anchor",
            type: "content",
            content: "",
            order: 1,
            xpReward: 25,
            challenge: null,
          },
          {
            id: 12,
            title: "Account Macros",
            type: "content",
            content: "",
            order: 2,
            xpReward: 25,
            challenge: null,
          },
          {
            id: 13,
            title: "Instruction Handlers",
            type: "content",
            content: "",
            order: 3,
            xpReward: 25,
            challenge: null,
          },
          {
            id: 14,
            title: "Build a TODO dApp",
            type: "challenge",
            content: "",
            order: 4,
            xpReward: 100,
            challenge: null,
          },
        ],
      },
      {
        id: 5,
        title: "Advanced Anchor",
        order: 2,
        lessons: [
          {
            id: 15,
            title: "Custom Errors & Events",
            type: "content",
            content: "",
            order: 1,
            xpReward: 30,
            challenge: null,
          },
          {
            id: 16,
            title: "CPIs in Anchor",
            type: "content",
            content: "",
            order: 2,
            xpReward: 30,
            challenge: null,
          },
          {
            id: 17,
            title: "Testing with Bankrun",
            type: "content",
            content: "",
            order: 3,
            xpReward: 30,
            challenge: null,
          },
          {
            id: 18,
            title: "Build a Voting Program",
            type: "challenge",
            content: "",
            order: 4,
            xpReward: 100,
            challenge: null,
          },
        ],
      },
    ],
    publishedAt: "2026-01-20T00:00:00.000Z",
  },
  {
    id: 3,
    title: "DeFi on Solana",
    slug: "defi-on-solana",
    description:
      "Understand DeFi primitives on Solana — token swaps, AMMs, lending protocols, and yield strategies. Build a mini DEX from scratch.",
    difficulty: "advanced",
    duration: 16,
    thumbnailUrl: null,
    track: "DeFi Developer",
    xpReward: 1200,
    modules: [
      {
        id: 6,
        title: "DeFi Foundations",
        order: 1,
        lessons: [
          {
            id: 19,
            title: "DeFi Landscape on Solana",
            type: "content",
            content: "",
            order: 1,
            xpReward: 30,
            challenge: null,
          },
          {
            id: 20,
            title: "Constant Product AMMs",
            type: "content",
            content: "",
            order: 2,
            xpReward: 40,
            challenge: null,
          },
          {
            id: 21,
            title: "Oracles & Price Feeds",
            type: "content",
            content: "",
            order: 3,
            xpReward: 30,
            challenge: null,
          },
        ],
      },
      {
        id: 7,
        title: "Building a DEX",
        order: 2,
        lessons: [
          {
            id: 22,
            title: "Liquidity Pool Design",
            type: "content",
            content: "",
            order: 1,
            xpReward: 40,
            challenge: null,
          },
          {
            id: 23,
            title: "Swap Instructions",
            type: "content",
            content: "",
            order: 2,
            xpReward: 40,
            challenge: null,
          },
          {
            id: 24,
            title: "Build a Mini DEX",
            type: "challenge",
            content: "",
            order: 3,
            xpReward: 150,
            challenge: null,
          },
        ],
      },
    ],
    publishedAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: 4,
    title: "Full Stack Solana dApps",
    slug: "full-stack-solana",
    description:
      "End-to-end dApp development — from Anchor programs to React frontends with wallet integration, transaction handling, and real-time updates.",
    difficulty: "intermediate",
    duration: 14,
    thumbnailUrl: null,
    track: "Full Stack Solana",
    xpReward: 900,
    modules: [
      {
        id: 8,
        title: "Frontend Foundations",
        order: 1,
        lessons: [
          {
            id: 25,
            title: "Wallet Adapter Setup",
            type: "content",
            content: "",
            order: 1,
            xpReward: 25,
            challenge: null,
          },
          {
            id: 26,
            title: "Reading On-Chain Data",
            type: "content",
            content: "",
            order: 2,
            xpReward: 25,
            challenge: null,
          },
          {
            id: 27,
            title: "Sending Transactions",
            type: "content",
            content: "",
            order: 3,
            xpReward: 25,
            challenge: null,
          },
          {
            id: 28,
            title: "Build a Token Dashboard",
            type: "challenge",
            content: "",
            order: 4,
            xpReward: 75,
            challenge: null,
          },
        ],
      },
      {
        id: 9,
        title: "Production dApp",
        order: 2,
        lessons: [
          {
            id: 29,
            title: "Error Handling & Retries",
            type: "content",
            content: "",
            order: 1,
            xpReward: 30,
            challenge: null,
          },
          {
            id: 30,
            title: "RPC Best Practices",
            type: "content",
            content: "",
            order: 2,
            xpReward: 30,
            challenge: null,
          },
          {
            id: 31,
            title: "Full Stack Project",
            type: "challenge",
            content: "",
            order: 3,
            xpReward: 150,
            challenge: null,
          },
        ],
      },
    ],
    publishedAt: "2026-02-05T00:00:00.000Z",
  },
  {
    id: 5,
    title: "Solana Security & Auditing",
    slug: "solana-security",
    description:
      "Learn to identify and prevent common vulnerabilities in Solana programs. Covers signer validation, PDA misuse, reentrancy, and audit methodology.",
    difficulty: "advanced",
    duration: 10,
    thumbnailUrl: null,
    track: "Solana Fundamentals",
    xpReward: 1000,
    modules: [
      {
        id: 10,
        title: "Common Vulnerabilities",
        order: 1,
        lessons: [
          {
            id: 32,
            title: "Missing Signer Checks",
            type: "content",
            content: "",
            order: 1,
            xpReward: 40,
            challenge: null,
          },
          {
            id: 33,
            title: "PDA Confusion Attacks",
            type: "content",
            content: "",
            order: 2,
            xpReward: 40,
            challenge: null,
          },
          {
            id: 34,
            title: "Arithmetic Overflows",
            type: "content",
            content: "",
            order: 3,
            xpReward: 40,
            challenge: null,
          },
          {
            id: 35,
            title: "Spot the Bug",
            type: "challenge",
            content: "",
            order: 4,
            xpReward: 100,
            challenge: null,
          },
        ],
      },
    ],
    publishedAt: "2026-02-10T00:00:00.000Z",
  },
  {
    id: 6,
    title: "NFTs & Compressed NFTs",
    slug: "nfts-compressed",
    description:
      "Create, mint, and manage NFTs on Solana using Metaplex and state compression. Learn how compressed NFTs reduce costs by 1000x.",
    difficulty: "intermediate",
    duration: 10,
    thumbnailUrl: null,
    track: "Full Stack Solana",
    xpReward: 750,
    modules: [
      {
        id: 11,
        title: "NFT Standards",
        order: 1,
        lessons: [
          {
            id: 36,
            title: "Metaplex Token Metadata",
            type: "content",
            content: "",
            order: 1,
            xpReward: 25,
            challenge: null,
          },
          {
            id: 37,
            title: "Collections & Verification",
            type: "content",
            content: "",
            order: 2,
            xpReward: 25,
            challenge: null,
          },
          {
            id: 38,
            title: "Mint an NFT Collection",
            type: "challenge",
            content: "",
            order: 3,
            xpReward: 75,
            challenge: null,
          },
        ],
      },
      {
        id: 12,
        title: "Compression",
        order: 2,
        lessons: [
          {
            id: 39,
            title: "State Compression & Merkle Trees",
            type: "content",
            content: "",
            order: 1,
            xpReward: 30,
            challenge: null,
          },
          {
            id: 40,
            title: "Compressed NFTs with Bubblegum",
            type: "content",
            content: "",
            order: 2,
            xpReward: 30,
            challenge: null,
          },
          {
            id: 41,
            title: "Build a cNFT Minter",
            type: "challenge",
            content: "",
            order: 3,
            xpReward: 100,
            challenge: null,
          },
        ],
      },
    ],
    publishedAt: "2026-02-12T00:00:00.000Z",
  },
];
