import '../components/theme.css'
import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom'
import { Col, Layout, Menu, Row, Spin, message } from 'antd'
import { DrizzleProvider, Initializer } from '../temp/drizzle-react-hooks'
import { ArchonInitializer } from './archon'
import { Helmet } from 'react-helmet'
import Identicon from '../components/identicon'
import { ReactComponent as Logo } from '../assets/images/logo.svg'
import NotificationSettings from '../components/notification-settings'
import Notifications from '../components/notifications'
import React from 'react'
import drizzle from './drizzle'
import loadable from '@loadable/component'
import { register } from './service-worker'
import styled from 'styled-components/macro'
import useNotifications from './use-notifications'

const StyledSpin = styled(Spin)`
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`
const C404 = loadable(
  () => import(/* webpackPrefetch: true */ '../containers/404'),
  {
    fallback: <StyledSpin />
  }
)
const Home = loadable(
  () => import(/* webpackPrefetch: true */ '../containers/home'),
  {
    fallback: <StyledSpin />
  }
)
const Courts = loadable(
  () => import(/* webpackPrefetch: true */ '../containers/courts'),
  {
    fallback: <StyledSpin />
  }
)
const Cases = loadable(
  () => import(/* webpackPrefetch: true */ '../containers/cases'),
  {
    fallback: <StyledSpin />
  }
)
const Case = loadable(
  async ({
    match: {
      params: { ID }
    }
  }) => {
    try {
      await drizzle.contracts.KlerosLiquid.methods.disputes(ID).call()
    } catch (err) {
      console.error(err)
      return C404
    }
    return import(/* webpackPrefetch: true */ '../containers/case')
  },
  {
    fallback: <StyledSpin />
  }
)
const Tokens = loadable(
  () => import(/* webpackPrefetch: true */ '../containers/tokens'),
  {
    fallback: <StyledSpin />
  }
)
const MenuItems = [
  <Menu.Item key="home">
    <NavLink to="/">Home</NavLink>
  </Menu.Item>,
  <Menu.Item key="courts">
    <NavLink to="/courts">Courts</NavLink>
  </Menu.Item>,
  <Menu.Item key="cases">
    <NavLink to="/cases">Cases</NavLink>
  </Menu.Item>,
  <Menu.Item key="tokens">
    <NavLink to="/tokens">Tokens</NavLink>
  </Menu.Item>
]
const settings = {
  appeal: 'When a case I ruled is appealed.',
  draw: 'When I am drawn as a juror.',
  key: 'court',
  lose: 'When I lose tokens.',
  win: 'When I win arbitration fees.'
}
const StyledLayoutSider = styled(Layout.Sider)`
  height: 100%;
  position: fixed;
  z-index: 2000;

  @media (min-width: 768px) {
    display: none;
  }

  .ant-layout-sider-zero-width-trigger {
    right: -50px;
    top: 12px;
    width: 50px;
  }
`
const StyledCol = styled(Col)`
  align-items: center;
  display: flex;
  height: 64px;
  justify-content: space-evenly;

  @media (max-width: 575px) {
    &.ant-col-xs-0 {
      display: none;
    }
  }
`
const StyledMenu = styled(Menu)`
  font-weight: bold;
  line-height: 64px !important;
  text-align: center;
`
const StyledLayoutContent = styled(Layout.Content)`
  background: white;
  padding: 0 9.375vw 62px;
`
export default () => (
  <>
    <Helmet>
      <title>Kleros · Court</title>
      <link
        href="https://fonts.googleapis.com/css?family=Roboto:400,400i,500,500i,700,700i"
        rel="stylesheet"
      />
    </Helmet>
    <DrizzleProvider drizzle={drizzle}>
      <Initializer
        error={<C404 Web3 />}
        loadingContractsAndAccounts={<C404 Web3 />}
        loadingWeb3={<StyledSpin tip="Connecting to your Web3 provider." />}
      >
        <ArchonInitializer>
          <BrowserRouter>
            <Layout>
              <StyledLayoutSider breakpoint="md" collapsedWidth="0">
                <Menu theme="dark">{MenuItems}</Menu>
              </StyledLayoutSider>
              <Layout>
                <Layout.Header>
                  <Row>
                    <StyledCol md={3} sm={16} xs={0}>
                      <Logo />
                    </StyledCol>
                    <Col md={16} xs={0}>
                      <StyledMenu mode="horizontal" theme="dark">
                        {MenuItems}
                      </StyledMenu>
                    </Col>
                    <StyledCol md={5} sm={8} xs={24}>
                      <Notifications useNotifications={useNotifications} />
                      <NotificationSettings settings={settings} />
                      <Identicon pinakion />
                    </StyledCol>
                  </Row>
                </Layout.Header>
                <StyledLayoutContent>
                  <Switch>
                    <Route component={Home} exact path="/" />
                    <Route component={Courts} exact path="/courts" />
                    <Route component={Cases} exact path="/cases" />
                    <Route component={Case} exact path="/cases/:ID" />
                    <Route component={Tokens} exact path="/tokens" />
                    <Route component={C404} />
                  </Switch>
                </StyledLayoutContent>
              </Layout>
            </Layout>
          </BrowserRouter>
        </ArchonInitializer>
      </Initializer>
    </DrizzleProvider>
  </>
)

register({
  onUpdate: () =>
    message.warning(
      'An update is ready to be installed. Please close and reopen all tabs.',
      0
    )
})
