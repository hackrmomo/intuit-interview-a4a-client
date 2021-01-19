import React, { useEffect, useState } from 'react';
import { Table, Typography, Dropdown, Menu, Row, Col, Button, InputNumber, Input, Form } from 'antd'
import { PageContainer } from '../components'

import dataSource from '../assets/staticData.json'
import { ColumnsType } from 'antd/lib/table';
import { ITransactionEntry, ICurrency, ICalculatedResults } from '../models';
import NumberFormat from 'react-number-format'
import axios from 'axios';

const { Title } = Typography

export const TrackerScreen = () => {

    const tableColumns: Array<ColumnsType<ITransactionEntry>> = [[
        { title: "Cash and Investments", dataIndex: "account", key: "account", width: "70%" },
        { title: "", dataIndex: "value", key: "value", width: "10%", align: "right", render: (val: number) => <MoneyField>{val}</MoneyField> }
    ], [
        { title: "Long Term Assets", dataIndex: "account", key: "account", width: "70%" },
        { title: "", dataIndex: "value", key: "value", width: "10%", align: "right", render: (val: number) => <MoneyField>{val}</MoneyField> }
    ], [
        { title: "Short Term Liabilities", dataIndex: "account", key: "account", width: "40%" },
        { title: "Monthly Payment", dataIndex: "monthlyPayment", key: "monthlyPayment", width: "30%", render: (val: number) => <MoneyField>{val}</MoneyField> },
        { title: "", dataIndex: "value", key: "value", width: "10%", align: "right", render: (val: number) => <MoneyField>{val}</MoneyField> }
    ], [
        { title: "Long Term Debt", dataIndex: "account", key: "account", width: "40%" },
        { title: "", dataIndex: "monthlyPayment", key: "monthlyPayment", width: "30%", render: (val: number) => <MoneyField>{val}</MoneyField> },
        { title: "", dataIndex: "value", key: "value", width: "10%", align: "right", render: (val: number) => <MoneyField>{val}</MoneyField> }
    ]];
    const currencies: Array<ICurrency> = [
        { code: "CAD", prefix: "$" },
        { code: "USD", prefix: "$" },
        { code: "EUR", prefix: "€" },
        { code: "HKD", prefix: "$" },
        { code: "KWD", prefix: "ك" },
        { code: "LYD", prefix: "ل.د" },
        { code: "JPY", prefix: "¥" },
        { code: "INR", prefix: "₹" },
        { code: "PKR", prefix: "₨" },
        { code: "MYR", prefix: "RM" }
    ]

    const [transactions, setTransactions] = useState<Array<ITransactionEntry>>(dataSource as Array<ITransactionEntry>)
    const [totalAssets, setTotalAssets] = useState<number>(transactions.filter(a => a.type === "asset").map(a => a.value).reduce((a, b) => a + b, 0))
    const [totalLiabilities, setTotalLiabilities] = useState<number>(transactions.filter(a => a.type === "liability").map(a => a.value).reduce((a, b) => a + b, 0))
    const [netWorth, setNetWorth] = useState<number>(totalAssets - totalLiabilities)
    const [currentCurrency, setCurrentCurrency] = useState<ICurrency>(currencies[0])

    interface IMoneyFieldProps {
        children: number
    }
    const MoneyField = (props: IMoneyFieldProps) => {
        return <NumberFormat decimalScale={2} value={props.children} displayType="text" thousandSeparator prefix={currentCurrency.prefix} />
    }

    const calculateUpdatedValues = async () => {
        const result = await axios.post<ICalculatedResults>(`${process.env.REACT_APP_SERVER_END_POINT}/calculator/calculate`, transactions)
        setTotalAssets(result.data.totalAssets)
        setTotalLiabilities(result.data.totalLiabilities)
        setNetWorth(result.data.netWorth)
    }

    const convertValuesToCurrency = async (from: string, to: string) => {
        const result = await axios.get<any>(`${process.env.REACT_APP_CURR_CONV_END_POINT}?q=${from}_${to}&compact=ultra&apiKey=${process.env.REACT_APP_CURR_CONV_KEY}`)
        const multiplier = result.data[`${from}_${to}`] as number
        setTransactions(transactions.map(a => ({ ...a, value: a.value * multiplier, monthlyPayment: a.monthlyPayment !== null ? a.monthlyPayment * multiplier : null })))
    }

    useEffect(() => {
        calculateUpdatedValues()
    }, [transactions])

    return <PageContainer>
        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
            <Dropdown overlay={() =>
                <Menu>
                    {currencies.map((currency, index) =>
                        <Menu.Item onClick={() => {
                            convertValuesToCurrency(currentCurrency.code, currency.code)
                            setCurrentCurrency(currency)
                        }} key={index}>
                            {currency.code}
                        </Menu.Item>
                    )}
                </Menu>
            }>
                <Button>{currentCurrency.code}</Button>
            </Dropdown>
        </div>
        <Row>
            <Col span={24}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <Title type="success" level={5}>Net Worth</Title>
                    <Title type="success" level={5}><MoneyField>{netWorth}</MoneyField></Title>
                </div>
            </Col>

        </Row>
        <Row>
            <Col span={24}>
                <Title type="success" level={5}>Assets</Title>
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <Table
                    pagination={false}
                    dataSource={transactions.filter(a => a.type === "asset" && a.accountTerm === "short")}
                    columns={tableColumns[0]}
                />
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <Table
                    pagination={false}
                    dataSource={transactions.filter(a => a.type === "asset" && a.accountTerm === "long")}
                    columns={tableColumns[1]}
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}>Total Assets</Table.Summary.Cell>
                            <Table.Summary.Cell align="right" index={1}><MoneyField>{totalAssets}</MoneyField></Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <Title type="success" level={5}>Liabilities</Title>
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <Table
                    pagination={false}
                    dataSource={transactions.filter(a => a.type === "liability" && a.accountTerm === "short")}
                    columns={tableColumns[2]}
                />
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <Table
                    pagination={false}
                    dataSource={transactions.filter(a => a.type === "liability" && a.accountTerm === "long")}
                    columns={tableColumns[3]}
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell colSpan={2} index={0}>Total Liabilities</Table.Summary.Cell>
                            <Table.Summary.Cell align="right" index={1}><MoneyField>{totalLiabilities}</MoneyField></Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </Col>
        </Row>
    </PageContainer>
}