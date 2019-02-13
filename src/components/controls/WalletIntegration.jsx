import React from 'react'

import Providers from '../../api/providers'

import { connect } from '../StateProvider'
import { getAPI } from '../../api'
import { getAppContracts } from '../../api/Contracts'

import ConfigDisplayerHOC from '../hoc/ConfigDisplayHOC'

class WalletIntegration extends React.Component {
  state = {
    activeProviderSet: undefined,
    error: undefined,
    initialising: false,
  }

  componentDidMount() {
    const { dispatchers: { registerProviders } } = this.props
    // returns [ Provider{}, ... ]
    const providersArray = Object.values(Providers)
    // register each providerObject into state
    return providersArray.forEach(() => { registerProviders(providersArray) })
  }

  /**
   * onChange Event Handler
   * @param { providerInfo } @type { ProviderObject }
   * @memberof WalletIntegration
   */
  onChange = async (providerInfo) => {
    const { dispatchers: { appLoading, setActiveProvider, grabUserState } } = this.props

    try {
      // Set loader
      appLoading(true)
      this.setState({ initialising: true, error: undefined })

      const chosenProvider = Providers[providerInfo]
      // initialize providers and return specific Web3 instances
      await chosenProvider.initialize()

      // Save activeProvider to State
      setActiveProvider(providerInfo)
      // Save web3 provider + notify state locally
      this.setState({ activeProviderSet: true })

      // interface with contracts & connect entire DX API
      // grabbing eth here to show contrived example of state
      const contracts = await getAppContracts()

      // registers/saves contracts to StateProvider
      this.saveContractToState(contracts)

      // INIT main API
      await getAPI()

      // First time grab userState
      await grabUserState()

      appLoading(false)

      return this.setState({ initialising: false })
    } catch (error) {
      console.error(error)
      appLoading(false)
      return this.setState({ initialising: false, error })
    }
  }

  saveContractToState = contracts => Object.keys(contracts).forEach(name => this.props.dispatchers.saveContract({ name, contract: contracts[name] }))

  walletSelector = () => (
    <div className="walletChooser">
      <h1>Please select a wallet</h1>
      <div className={!this.state.initialising ? 'lightBlue' : ''}>
        {Object.keys(Providers).map((provider, i) => {
          const providerInfo = Providers[provider].providerName || provider
          return (
            <div
              role="container"
              key={i}
              onClick={() => this.onChange(provider)}
            >
              <h4 className="providerChoice">{`${i + 1}. ${providerInfo}`}</h4>
            </div>
          )
        })}
      </div>
      {this.state.error && <h3>{this.state.error.message}</h3>}
    </div>
  )

  render() {
    const { initialising, activeProviderSet, error } = this.state,
      { state: { activeProvider }, children } = this.props

    // error occurred in async, show message
    if (error) return <h1>An error occurred: {error}</h1>
    // app state initialised, no longer loading
    // aka load app
    if ((activeProvider && activeProviderSet) && !initialising) return children

    // show user wallet selector
    return this.walletSelector()
  }
}

const mapProps = ({
  // state properties
  state: {
    PROVIDER: { activeProvider, network },
    USER: { account, balance },
    loading,
  },
  // dispatchers
  appLoading,
  grabUserState,
  grabDXState,
  registerProviders,
  setActiveProvider,
  getDXTokenBalance,
  saveContract,
}) => ({
  // state properties
  state: {
    activeProvider,
    network,
    account,
    balance,
    loading,
  },
  // dispatchers
  dispatchers: {
    appLoading,
    grabUserState,
    grabDXState,
    registerProviders,
    setActiveProvider,
    getDXTokenBalance,
    saveContract,
  },
})

export default connect(mapProps)(process.env.NODE_ENV !== 'production'
  ? ConfigDisplayerHOC(WalletIntegration)
  : WalletIntegration)
