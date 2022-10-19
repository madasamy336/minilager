import React, { Component } from 'react'
import { Accordion, Icon } from 'semantic-ui-react'

export default class TenantDetailEmergengyContactAccordian extends Component {
  
  state = { activeIndex: 0 }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { activeIndex } = this.state

    return (
 
      <Accordion styled fluid className='p-1'>


        <Accordion.Title className='d-flex justify-content-between align-items-center'
          active={activeIndex === 0}
          index={0}
          onClick={this.handleClick}
        >
        <div className='d-flex justify-content-between align-items-center'>
        Emergency Contact {this.props.contactLength}
          </div>
          <div>
            <img src="/assets/images/arrow-down.png" className='w-50 h-50' alt="" />
          </div>

        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <table className='ui celled table  tabel-borderless '>
            <tbody>
                <tr>
                    <td className='fw-600'>Name</td>
                    <td>{this.props.firtName} {this.props.lastName}</td>
                </tr>
                <tr>
                    <td className='fw-600'>Email</td>
                    <td>{this.props.email}</td>
                </tr>
                <tr>
                    <td className='fw-600'>Phone Number</td>
                    <td>{this.props.phone}</td>
                </tr>
            </tbody>
          </table>
          <div className='text-center'>
          <button onClick={()=>this.props.removefunction(this.props.index)} class="ui button bg-danger   fs-7 fw-400 text-white px-5" >Remove</button>
          </div>
        </Accordion.Content>
      </Accordion>
    )
  }
}