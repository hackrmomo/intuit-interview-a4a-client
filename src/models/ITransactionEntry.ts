export interface ITransactionEntry {
    account: string
    type: "asset" | "liability"
    accountTerm: "short" | "long"
    value: number
    monthlyPayment: null | number
}