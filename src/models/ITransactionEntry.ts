export interface ITransactionEntry {
    id: string
    account: string
    type: "asset" | "liability"
    accountTerm: "short" | "long"
    value: number
    monthlyPayment: null | number
}