import React, { useState } from 'react'
import { } from '@ant-design/icons'
import { Input } from 'antd'
import { ICurrency } from '../models'

export interface IMoneyInputProps {
    val: number
    currency: ICurrency
    onBlur: ((event: React.FocusEvent<HTMLInputElement>) => void) | undefined
}

export const MoneyInput = (props: IMoneyInputProps) => {
    const { val, currency, onBlur } = props
    const [value, setValue] = useState(val.toFixed(2))
    return <Input
        addonBefore={currency.prefix}
        onBlur={e => {
            onBlur && onBlur(e)
        }}
        onChange={e => {
            const { value: changed } = e.target;
            const reg = /^-?\d*(\.\d*)?$/;
            if ((!isNaN(parseFloat(changed)) && reg.test(changed)) || changed === '' || changed === '-') {
                setValue(isNaN(parseFloat(changed)) ? "0" : changed)
            }
        }}
        value={value} />
}