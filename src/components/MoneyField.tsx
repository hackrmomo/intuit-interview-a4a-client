import NumberFormat from 'react-number-format'
import {ICurrency} from '../models'

export interface IMoneyFieldProps {
    children: number
    currency: ICurrency
}
export const MoneyField = (props: IMoneyFieldProps) => {
    const {children, currency} = props
    return <NumberFormat decimalScale={2} value={children} displayType="text" thousandSeparator prefix={currency.prefix} />
}