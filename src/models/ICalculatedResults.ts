import { ITransactionEntry } from "./ITransactionEntry";

export interface ICalculatedResults {
    netWorth: number
    totalAssets: number
    totalLiabilities: number
    transactions: Array<ITransactionEntry>
}