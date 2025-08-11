export interface CryptoPriceData {
  cryptocurrency: string;
  price: number;
  currency: string;
  change24h: number;
  lastUpdated: string;
}

export interface PriceHistoryPoint {
  timestamp: number;
  price: number;
  date: string;
}

export interface PriceHistoryData {
  cryptocurrency: string;
  currency: string;
  prices: PriceHistoryPoint[];
}

export interface CalculationInput {
  cryptocurrency: string;
  investmentAmount: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
  currency: string;
  calculationType: 'profit-loss' | 'future-projection' | 'dca' | 'portfolio';
}

export interface CalculationResults {
  totalProfit: number;
  roiPercentage: number;
  initialInvestment: number;
  currentValue: number;
  profitLoss: number;
  coinAmount: number;
}

export interface DCAEntry {
  date: string;
  investment: number;
  price: number;
  amount: number;
  total: number;
  profit: number;
}

export const SUPPORTED_CRYPTOS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'tether', name: 'Tether', symbol: 'USDT' },
  { id: 'binance-coin', name: 'BNB', symbol: 'BNB' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'usd-coin', name: 'USD Coin', symbol: 'USDC' },
  { id: 'xrp', name: 'XRP', symbol: 'XRP' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
  { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX' },
  { id: 'shiba-inu', name: 'Shiba Inu', symbol: 'SHIB' },
  { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
  { id: 'bitcoin-cash', name: 'Bitcoin Cash', symbol: 'BCH' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC' },
  { id: 'litecoin', name: 'Litecoin', symbol: 'LTC' },
  { id: 'wrapped-bitcoin', name: 'Wrapped Bitcoin', symbol: 'WBTC' },
  { id: 'dai', name: 'Dai', symbol: 'DAI' },
  { id: 'uniswap', name: 'Uniswap', symbol: 'UNI' },
  { id: 'ethereum-classic', name: 'Ethereum Classic', symbol: 'ETC' },
  { id: 'stellar', name: 'Stellar', symbol: 'XLM' },
  { id: 'filecoin', name: 'Filecoin', symbol: 'FIL' },
  { id: 'cosmos', name: 'Cosmos Hub', symbol: 'ATOM' },
  { id: 'algorand', name: 'Algorand', symbol: 'ALGO' },
  { id: 'vechain', name: 'VeChain', symbol: 'VET' },
  { id: 'hedera', name: 'Hedera', symbol: 'HBAR' },
  { id: 'internet-computer', name: 'Internet Computer', symbol: 'ICP' },
  { id: 'the-sandbox', name: 'The Sandbox', symbol: 'SAND' },
  { id: 'decentraland', name: 'Decentraland', symbol: 'MANA' },
  { id: 'theta', name: 'Theta Network', symbol: 'THETA' },
  { id: 'elrond', name: 'MultiversX', symbol: 'EGLD' },
  { id: 'ftx-token', name: 'FTX Token', symbol: 'FTT' },
  { id: 'aave', name: 'Aave', symbol: 'AAVE' },
  { id: 'axie-infinity', name: 'Axie Infinity', symbol: 'AXS' },
  { id: 'eos', name: 'EOS', symbol: 'EOS' },
  { id: 'tezos', name: 'Tezos', symbol: 'XTZ' },
  { id: 'flow', name: 'Flow', symbol: 'FLOW' },
  { id: 'pancakeswap', name: 'PancakeSwap', symbol: 'CAKE' },
  { id: 'klaytn', name: 'Klaytn', symbol: 'KLAY' },
  { id: 'bitcoin-sv', name: 'Bitcoin SV', symbol: 'BSV' },
  { id: 'fantom', name: 'Fantom', symbol: 'FTM' },
  { id: 'compound', name: 'Compound', symbol: 'COMP' },
  { id: 'maker', name: 'Maker', symbol: 'MKR' },
  { id: 'neo', name: 'Neo', symbol: 'NEO' },
  { id: 'kucoin', name: 'KuCoin Token', symbol: 'KCS' },
  { id: 'celsius', name: 'Celsius', symbol: 'CEL' },
  { id: 'waves', name: 'Waves', symbol: 'WAVES' },
  { id: 'amp', name: 'Amp', symbol: 'AMP' },
  { id: 'helium', name: 'Helium', symbol: 'HNT' },
  { id: 'terra-luna', name: 'Terra Luna Classic', symbol: 'LUNC' },
  { id: 'near', name: 'NEAR Protocol', symbol: 'NEAR' },
  { id: 'thorchain', name: 'THORChain', symbol: 'RUNE' },
  { id: 'monero', name: 'Monero', symbol: 'XMR' },
  { id: 'iota', name: 'IOTA', symbol: 'MIOTA' },
  { id: 'kusama', name: 'Kusama', symbol: 'KSM' },
  { id: 'zcash', name: 'Zcash', symbol: 'ZEC' },
  { id: 'dash', name: 'Dash', symbol: 'DASH' },
  { id: 'enjin', name: 'Enjin Coin', symbol: 'ENJ' },
  { id: 'sushi', name: 'SushiSwap', symbol: 'SUSHI' },
  { id: 'yearn-finance', name: 'yearn.finance', symbol: 'YFI' },
  { id: 'chiliz', name: 'Chiliz', symbol: 'CHZ' },
  { id: 'harmony', name: 'Harmony', symbol: 'ONE' },
  { id: 'curve', name: 'Curve DAO Token', symbol: 'CRV' },
  { id: '1inch', name: '1inch Network', symbol: '1INCH' },
  { id: 'quant', name: 'Quant', symbol: 'QNT' },
  { id: 'gala', name: 'Gala', symbol: 'GALA' },
  { id: 'immutable-x', name: 'Immutable X', symbol: 'IMX' },
  { id: 'loopring', name: 'Loopring', symbol: 'LRC' },
  { id: 'basic-attention', name: 'Basic Attention Token', symbol: 'BAT' },
  { id: 'zilliqa', name: 'Zilliqa', symbol: 'ZIL' },
  { id: 'decred', name: 'Decred', symbol: 'DCR' },
  { id: 'mina', name: 'Mina', symbol: 'MINA' },
  { id: 'ocean', name: 'Ocean Protocol', symbol: 'OCEAN' },
  { id: 'livepeer', name: 'Livepeer', symbol: 'LPT' },
  { id: 'raydium', name: 'Raydium', symbol: 'RAY' },
  { id: 'serum', name: 'Serum', symbol: 'SRM' },
  { id: 'celo', name: 'Celo', symbol: 'CELO' },
  { id: 'omg', name: 'OMG Network', symbol: 'OMG' },
  { id: 'arweave', name: 'Arweave', symbol: 'AR' },
  { id: 'ren', name: 'Ren', symbol: 'REN' },
  { id: 'nervos', name: 'Nervos Network', symbol: 'CKB' },
  { id: 'icon', name: 'ICON', symbol: 'ICX' },
  { id: 'qtum', name: 'Qtum', symbol: 'QTUM' },
  { id: 'theta-fuel', name: 'Theta Fuel', symbol: 'TFUEL' },
  { id: 'ravencoin', name: 'Ravencoin', symbol: 'RVN' },
  { id: 'digibyte', name: 'DigiByte', symbol: 'DGB' },
  { id: 'bittorrent', name: 'BitTorrent', symbol: 'BTT' },
  { id: 'pirate-chain', name: 'Pirate Chain', symbol: 'ARRR' },
  { id: 'golem', name: 'Golem', symbol: 'GLM' },
  { id: 'storj', name: 'Storj', symbol: 'STORJ' },
  { id: 'civic', name: 'Civic', symbol: 'CVC' },
  { id: 'status', name: 'Status', symbol: 'SNT' },
  { id: 'syscoin', name: 'Syscoin', symbol: 'SYS' },
  { id: 'stacks', name: 'Stacks', symbol: 'STX' },
  { id: 'verge', name: 'Verge', symbol: 'XVG' },
  { id: 'wax', name: 'WAX', symbol: 'WAXP' },
  { id: 'ankr', name: 'Ankr', symbol: 'ANKR' },
  { id: 'fetch-ai', name: 'Fetch.ai', symbol: 'FET' },
  { id: 'nano', name: 'Nano', symbol: 'XNO' },
  { id: 'holo', name: 'Holo', symbol: 'HOT' },
  { id: 'request', name: 'Request', symbol: 'REQ' },
  { id: 'polymath', name: 'Polymath', symbol: 'POLY' }
] as const;

export const SUPPORTED_CURRENCIES = [
  { id: 'usd', name: 'US Dollar', symbol: '$' },
  { id: 'eur', name: 'Euro', symbol: '€' },
  { id: 'gbp', name: 'British Pound', symbol: '£' },
  { id: 'inr', name: 'Indian Rupee', symbol: '₹' }
] as const;
