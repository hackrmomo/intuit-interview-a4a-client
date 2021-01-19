import React, { useState } from 'react';
import { Table, Typography, Dropdown, Menu, Row, Col, Button } from 'antd'
import { EditOutlined, CheckOutlined } from '@ant-design/icons'
import { PageContainer, MoneyInput, MoneyField } from '../components'

import dataSource from '../assets/staticData.json'
import { ColumnsType } from 'antd/lib/table';
import { ITransactionEntry, ICurrency, ICalculatedResults } from '../models';
import axios from 'axios';

const { Title } = Typography

export const TrackerScreen = () => {

    const moneyRenderMethod = (type: "monthlyPayment" | "value") => (val: number, entry: ITransactionEntry) => editable
        ? <MoneyInput currency={currentCurrency} key={entry.id} onBlur={(e) => {
            setTransactions(transactions.map(a => entry.id === a.id ? ({
                ...a,
                monthlyPayment: type === "monthlyPayment" ? parseFloat(e.target.value) : a.monthlyPayment,
                value: type === "value" ? parseFloat(e.target.value) : a.value
            }) : a))
        }} type={type} entry={entry} val={val} />
        : <MoneyField currency={currentCurrency} key={entry.id}>{val}</MoneyField>

    const tableColumns: Array<ColumnsType<ITransactionEntry>> = [[
        { title: "Cash and Investments", dataIndex: "account", key: "account", width: "70%" },
        { title: "", dataIndex: "value", key: "value", width: "10%", align: "right", render: moneyRenderMethod("value") }
    ], [
        { title: "Long Term Assets", dataIndex: "account", key: "account", width: "70%" },
        { title: "", dataIndex: "value", key: "value", width: "10%", align: "right", render: moneyRenderMethod("value") }
    ], [
        { title: "Short Term Liabilities", dataIndex: "account", key: "account", width: "40%" },
        { title: "Monthly Payment", dataIndex: "monthlyPayment", key: "monthlyPayment", width: "30%", render: moneyRenderMethod("monthlyPayment") },
        { title: "", dataIndex: "value", key: "value", width: "10%", align: "right", render: moneyRenderMethod("value") }
    ], [
        { title: "Long Term Debt", dataIndex: "account", key: "account", width: "40%" },
        { title: "", dataIndex: "monthlyPayment", key: "monthlyPayment", width: "30%", render: moneyRenderMethod("monthlyPayment") },
        { title: "", dataIndex: "value", key: "value", width: "10%", align: "right", render: moneyRenderMethod("value") }
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
    const [editable, setEditable] = useState<boolean>(false)

    const calculateUpdatedValues = async (from: string = "CAD", to: string = "CAD") => {
        const result = await axios.post<ICalculatedResults>(`${process.env.REACT_APP_SERVER_END_POINT}/calculator/calculate?conversionType=${from}_${to}`, transactions)
        setTotalAssets(result.data.totalAssets)
        setTotalLiabilities(result.data.totalLiabilities)
        setNetWorth(result.data.netWorth)
        setTransactions(result.data.transactions)
    }

    return <PageContainer>

        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
            <Dropdown overlay={() =>
                <Menu>
                    {currencies.map((currency, index) =>
                        <Menu.Item onClick={async () => {
                            await calculateUpdatedValues(currentCurrency.code, currency.code)
                            setCurrentCurrency(currency)
                        }} key={index}>
                            {currency.code}
                        </Menu.Item>
                    )}
                </Menu>
            }>
                <Button>{currentCurrency.code}</Button>
            </Dropdown>
            <Button onClick={async () => {
                setEditable(!editable)
                await calculateUpdatedValues()
            }} icon={editable ? <CheckOutlined /> : <EditOutlined />}></Button>
        </div>
        <Row>
            <Col span={24}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <Title type="success" level={5}>Net Worth</Title>
                    <Title type="success" level={5}><MoneyField currency={currentCurrency} key={"netWorth"}>{netWorth}</MoneyField></Title>
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
                    rowKey={(a) => a.id}
                />
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <Table
                    pagination={false}
                    dataSource={transactions.filter(a => a.type === "asset" && a.accountTerm === "long")}
                    columns={tableColumns[1]}
                    rowKey={(a) => a.id}
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell key={"totalAssetsTitle"} index={0}>Total Assets</Table.Summary.Cell>
                            <Table.Summary.Cell align="right" index={1}><MoneyField currency={currentCurrency} key={"totalAssets"}>{totalAssets}</MoneyField></Table.Summary.Cell>
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
                    rowKey={(a) => a.id}
                />
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <Table
                    pagination={false}
                    dataSource={transactions.filter(a => a.type === "liability" && a.accountTerm === "long")}
                    columns={tableColumns[3]}
                    rowKey={(a) => a.id}
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell key={"totalLiabilitiesTitle"} colSpan={2} index={0}>Total Liabilities</Table.Summary.Cell>
                            <Table.Summary.Cell align="right" index={1}><MoneyField currency={currentCurrency} key={"totalLiabilities"}>{totalLiabilities}</MoneyField></Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </Col>
        </Row>
    </PageContainer>
}