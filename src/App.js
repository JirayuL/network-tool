import React, { Component } from 'react'
import { Table } from 'antd'
import styled from 'styled-components'
import { createSubnet, getMask, getNumberOfHost, getNumberOfNetwork, getNetworkClass } from './createSubNet'
import 'antd/dist/antd.css'
import Loader from 'react-loader-spinner'

const Background = styled.div`
  background-image: url('https://newsroom.cisco.com/documents/10157/14740/internet-emerge-econ_1200x675_hero_071317.jpg/d1ff2819-b7a4-42d1-b257-8de2c00d3aa3');
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
  position: fixed;
  filter: brightness(50%);
  z-index: -99;
`

const Container = styled.div`
  color: white;
  text-align: center;
`

const Title = styled.h2`
  font-size: 35px;
  margin: auto;
  color: white;
  padding: 40px 0;
`

const FormBox = styled.div`
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  max-width: 600px;
  margin: auto;
  padding: 30px;
`

const Form = styled.div`
  width: 370px;
  margin: auto;
  text-align: right;

  & > * {
    margin-right: 0;
  }

  @media (max-width: 420px) {
    text-align: center;
  }
`

const Input = styled.input`
  margin: 15px 0 15px auto;
  padding: 5px 3px;
  font-size: 18px;
  color: white;
  width: 170px;
  background-color: rgba(255, 255, 255, 0.1);
  border: solid grey 0.5px;
  border-radius: 5px;
`

const Button = styled.button`
  margin-top: 10px;
  padding: 8px 15px;
  font-size: 17px;
  background-color: rgb(30, 188, 48, 0.4);
  color: white;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
  background-color: rgb(30, 188, 48, 0.2);
  }
`

const InputContainer = styled.div`
  display: flex;
  
  @media (max-width: 420px) {
    display: block;
    text-align: center;
  }
`

const Error = styled.p`
  color: red;
  margin: 0;
`

const columns = [
  {
    title: 'Subnet',
    dataIndex: 'subnet',
    key: 'subnet',
  },
  {
    title: 'Subnet ID',
    dataIndex: 'subnetID',
    key: 'subnetID',
  },
  {
    title: 'First host',
    dataIndex: 'firstHost',
    key: 'firstHost',
  },
  {
    title: 'Last host',
    dataIndex: 'lastHost',
    key: 'lastHost',
  },
  {
    title: 'Boardcast',
    dataIndex: 'boardcast',
    key: 'boardcast',
  },
]

let data = []

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ip: '',
      network: '0',
      host: '0',
      error: ' ',
    }
    this.loading = false
  }

  handleInputChange = (e) => {
    const { value, name } = e.target
    const newState = { [name]: value }
    if (name === 'network')
      newState.host = 0
    else if (name === 'host')
      newState.network = 0
    this.setState(newState)
  }

  validateIP(ip) {
    try {
      const ipSplit = ip.split('.')
      const msg = 'Each part of IP Address must be 0 - 255.'
      if (!ipSplit || (ipSplit && ipSplit.length !== 4)) {
        return msg
      }
      for (let ipPart of ipSplit) {
        if (ipPart.length > 3 || isNaN(ipPart)) {
          return msg
        }
        if (Number(ipPart) < 0 || Number(ipPart) > 255) {
          return msg
        }
      }
      return ''
    } catch (e) {
      return this.setState({ error: 'IP Address is not in a valid form' })
    }
  }

  submit = () => {
    this.loading = true
    const { ip, network, host } = this.state
    if (!ip || (ip && ip.length === 0))
      return this.setState({ error: 'IP Address is required' })
    const msg = this.validateIP(ip)
    if (msg)
      return this.setState({ error: msg })
    if (host === '0' && network === '0')
      return this.setState({ error: 'Number of host or network is required' })
    this.setState({ error: '' })
    const res = createSubnet(ip, network, host)
    if (typeof res === 'string') {
      this.loading = false
      return this.setState({ error: res })
    }
    data = res
    this.loading = false
  }

  render() {
    return (
      <Container>
        <Background />
        <Title>
          Subnet mask generator
          </Title>
        <FormBox>
          {this.loading ? <Loader
            type="Puff"
            color="#00BFFF"
            height="300"
            width="300"
          /> :
            <div>
              <Error>
                {this.state.error}
              </Error>
              <Form>
                <InputContainer>
                  <p style={{ marginTop: '20px' }}>IP Address</p><Input name="ip" maxLength="15" onChange={this.handleInputChange} value={this.state.ip} />
                </InputContainer>
                <InputContainer>
                  <p style={{ marginTop: '20px' }}>Number of network</p><Input name="network" type="number" maxLength="7" onChange={this.handleInputChange} value={this.state.network} />
                </InputContainer>
                <InputContainer>
                  <p style={{ marginTop: '20px' }}>Number of host</p><Input name="host" type="number" maxLength="7" onChange={this.handleInputChange} value={this.state.host} />
                </InputContainer>
                <Button onClick={() => this.submit()}>Submit</Button>
              </Form>
            </div>
          }
        </FormBox>
        {
          data && data.length > 0 ?
            <div>
              <FormBox style={{ marginTop: '30px', marginBottom: '30px' }}>
                <div style={{ width: '500px', margin: 'auto', textAlign: 'left', display: 'flex' }}>
                  <div style={{ color: 'orange' }}>
                    <p>Mask:</p>
                    <p>Network class:</p>
                    <p>Number of network:</p>
                    <p>Number of host:</p>
                  </div>
                  <div style={{ marginLeft: '50px' }}>
                    <p>{getMask() || '-'}</p>
                    <p>{getNetworkClass() || '-'}</p>
                    <p>{getNumberOfNetwork() || 0}</p>
                    <p>{getNumberOfHost() || 0}</p>
                  </div>
                </div>
              </FormBox>
              <Table
                dataSource={data}
                columns={columns}
                rowKey="subnetID"
                rowClassName="row"
                className="table"
              />
            </div>
            : ''
        }
        <style>{`
          .table {
            background: rgba(73, 73, 73, 0.9);
          }
          th {
            background: rgba(0, 0, 0, 0.3) !important;
            color: yellow !important;
          }
          .row {
            color: white !important;
          }
          .row:hover, ant-table-row:hover {
            opacity: 0.5;
            color: black !important;
            animation: none !important;
          }
          .ant-pagination > *, .ant-pagination > * > * {
            background: rgb(198, 198, 198) !important;
          }
        `}</style>
      </Container>
    );
  }
}

export default App;
