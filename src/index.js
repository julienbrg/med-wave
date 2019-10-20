import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Ocean } from '@oceanprotocol/squid'
import Web3 from 'web3'
import asset from './asset'

let web3

if (window.web3) {
  web3 = new Web3(window.web3.currentProvider)
  window.ethereum.enable()
}

class App extends Component {
  state = {
    ocean: undefined,
    results: []
  }

  async componentDidMount() {
    const ocean = await new Ocean.getInstance({
      web3Provider: web3,
      nodeUri: 'https://nile.dev-ocean.com',
      aquariusUri: 'https://aquarius.marketplace.dev-ocean.com',
      brizoUri: 'https://brizo.marketplace.dev-ocean.com',
      brizoAddress: '0x4aaab179035dc57b35e2ce066919048686f82972',
      secretStoreUri: 'https://secret-store.nile.dev-ocean.com',
      // local Spree connection
      // nodeUri: 'http://localhost:8545',
      // aquariusUri: 'http://aquarius:5000',
      // brizoUri: 'http://localhost:8030',
      // brizoAddress: '0x00bd138abd70e2f00903268f3db08f2d25677c9e',
      // secretStoreUri: 'http://localhost:12001',
      verbose: true
    })
    this.setState({ ocean })
    console.log('Finished loading contracts.')
  }

  async registerAsset(one, two, three) {
    try {
	if (!one)
	asset.base.disease_name = one
	if (!two)
	asset.base.quantity_case = two
	if (!three)
	asset.base.author = three
      const accounts = await this.state.ocean.accounts.list()
	console.log(accounts)
      const ddo = await this.state.ocean.assets.create(asset, accounts[0])
      console.log('Asset successfully submitted.')
      console.log(ddo)
      alert(
        'Asset successfully submitted. Look into your console to see the response DDO object.'
      )
    } catch (error) {
      console.error(error.message)
    }
  }

  async searchAssets(searchString) {
    try {
      const search = await this.state.ocean.assets.search(searchString) 
      this.setState({ results: search.results })
      console.log(search)
      alert(
        'Asset successfully retrieved. Look into your console to see the search response.'
      )
    } catch (error) {
      console.error(error.message)
    }
  }

  async consumeAsset() {
    try {
      // get all accounts
      const accounts = await this.state.ocean.accounts.list()
      // get first asset from search results
      const consumeAsset = this.state.results[0]
      // get service we want to execute
      const service = consumeAsset.findServiceByType('Access')
      // order service agreement
      const agreement = await this.state.ocean.assets.order(
        consumeAsset.id,
        service.serviceDefinitionId,
        accounts[0]
      )
      // consume it
      await this.state.ocean.assets.consume(
        agreement,
        consumeAsset.id,
        service.serviceDefinitionId,
        accounts[0],
        '',
        0
      )
    } catch (error) {
      console.error(error.message)
    }
  }

  render() {
    return (
      <div style={{ fontFamily: '"Fira Code", monospace', textAlign: 'center' }} >

	<form>
                Name of the disease:    <input type='text' name='disease' /> <br />
                Quantity of cases:      <input type='number' name='quantity' /> <br />
                Ethereum address:       <input type='text' name='eth_address' /> <br />
                Your email address:     <input type='email' name='email' /> <br />
                <button onClick={() => this.registerAsset(document.getElementsByName('disease')[0].value, document.getElementsByName('quantity')[0].value, document.getElementsByName('email')[0].value)} disabled={!web3} > Submit </button>
        </form>

      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
