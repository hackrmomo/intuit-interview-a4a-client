import React, { useState } from 'react';
import { Table, Typography, Dropdown, Menu, Row, Col } from 'antd'
import { PageContainer } from '../components'

import dataSource from '../assets/staticData.json'
import { ColumnsType } from 'antd/lib/table';
import { ITransactionEntry } from '../models';

const { Title } = Typography

export const TrackerScreen = () => {
    const tableColumns: Array<ColumnsType<ITransactionEntry>> = [[
        { title: "Cash and Investments", dataIndex: "account", key: "account", width: "70%" },
        { title: "", dataIndex: "value", key: "value", width: "10%", align: "right" }
    ], [
        { title: "Long Term Assets", dataIndex: "account", key: "account", width: "70%" },
        { title: "", dataIndex: "value", key: "value", width: "10%", align: "right" }
    ], [
        { title: "Short Term Liabilities", dataIndex: "account", key: "account", width: "40%" },
        { title: "Monthly Payment", dataIndex: "monthlyPayment", key: "monthlyPayment", width: "30%" },
        { title: "", dataIndex: "value", key: "value", width: "10%", align: "right" }
    ], [
        { title: "Long Term Debt", dataIndex: "account", key: "account", width: "40%" },
        { title: "", dataIndex: "monthlyPayment", key: "monthlyPayment", width: "30%" },
        { title: "", dataIndex: "value", key: "value", width: "10%", align: "right" }
    ]];

    const [transactions, setTransactions] = useState<Array<ITransactionEntry>>(dataSource as Array<ITransactionEntry>)

    const currencies = [
        "CAD",
        "USD",
        "EUR",
        "HKD",
        "KWD",
        "LYD",
        "JPY",
        "INR",
        "PKR",
        "MYR"
    ]

    const currencyMenu = (<Menu>
        {currencies.map((currency, index) =>
            <Menu.Item key={index}>{currency}</Menu.Item>
        )}
    </Menu>)

    return <PageContainer>
        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
            <Dropdown overlay={currencyMenu}>
                <a>Select Currency</a>
            </Dropdown>
        </div>
        <Row>
            <Col span={24}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <Title type="success" level={5}>Net Worth</Title>
                    <Title type="success" level={5}>{`<Net Worth>`}</Title>
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
                            <Table.Summary.Cell index={1}>{`<total>`}</Table.Summary.Cell>
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
                            <Table.Summary.Cell index={1}>{`<total>`}</Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </Col>
        </Row>
    </PageContainer>
}