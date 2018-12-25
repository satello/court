import { Button, Col, Row, Spin } from 'antd'
import React, { useState } from 'react'
import { useDrizzle, useDrizzleState } from '../temp/drizzle-react-hooks'
import CourtCard from '../components/court-card'
import CourtDrawer from '../components/court-drawer'
import TopBanner from '../components/top-banner'

export default () => {
  const { useCacheCall } = useDrizzle()
  const drizzleState = useDrizzleState(drizzleState => ({
    account: drizzleState.accounts[0]
  }))
  const [activeID, setActiveID] = useState()
  const subcourtIDs = useCacheCall(
    'KlerosLiquid',
    'getJuror',
    drizzleState.account
  )
  return (
    <>
      <TopBanner
        description="Select courts and stake PNK."
        extra={
          <Button size="large" type="primary">
            Select Court
          </Button>
        }
        title="Courts"
      />
      My Courts
      <Spin spinning={!subcourtIDs}>
        <Row gutter={40}>
          {subcourtIDs &&
            subcourtIDs.map(ID => (
              <Col key={ID} span={8}>
                <CourtCard ID={ID} onClick={setActiveID} />
              </Col>
            ))}
        </Row>
      </Spin>
      {activeID !== undefined && (
        <CourtDrawer ID={activeID} onClose={setActiveID} />
      )}
    </>
  )
}
