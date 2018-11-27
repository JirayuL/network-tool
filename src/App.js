import React, { Component } from 'react'
import styled from 'styled-components'

const Background = styled.div`
  background-image: url('https://newsroom.cisco.com/documents/10157/14740/internet-emerge-econ_1200x675_hero_071317.jpg/d1ff2819-b7a4-42d1-b257-8de2c00d3aa3');
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
`

const Container = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  color: white;
  text-align: center;
`

const Title = styled.h2`
  font-size: 35px;
  margin: auto;
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
  
  @media (max-width: 410px) {
    display: block;
  }
`

const Error = styled.p`
  color: red;
  margin: 0;
`

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ip: '',
      network: '0',
      host: '0',
      error: ' ',
    }
  }

  handleInputChange = (e) => {
    const { value, name, maxLength } = e.target
    const newState = { [name]: value.slice(0, maxLength) }
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
      if (ipSplit.length !== 4) {
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
    if (this.state.ip.length === 0)
      return this.setState({ error: 'IP Address is required' })
    const msg = this.validateIP(this.state.ip)
    if (msg)
      return this.setState({ error: msg })
    if (this.state.host === '0' && this.state.network === '0')
      return this.setState({ error: 'Number of host or network is required' })
    this.setState({ error: '' })
  }

  render() {
    return (
      <Background>
        <Container>
          <Title>
            Subnet mask generators
          </Title>
          <FormBox>
            <Error>
              {this.state.error}
            </Error>
            <Form>
              <InputContainer>
                <p>IP Address</p><Input name="ip" maxLength="15" onChange={this.handleInputChange} value={this.state.ip} />
              </InputContainer>
              <InputContainer>
                <p>Number of network</p><Input name="network" type="number" maxLength="7" onChange={this.handleInputChange} value={this.state.network} />
              </InputContainer>
              <InputContainer>
                <p>Number of host</p><Input name="host" type="number" maxLength="7" onChange={this.handleInputChange} value={this.state.host} />
              </InputContainer>
              <Button onClick={() => this.submit()}>Submit</Button>
            </Form>
          </FormBox>
        </Container>
      </Background>
    );
  }
}

export default App;
