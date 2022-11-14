import React, { Component } from 'react'
import { Accordion } from 'semantic-ui-react'
import UnitsRangeSlider from '../unitsrangeslider/UnitsRangeSlider'

export default class AccordionExampleStyled extends Component {
  
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
      <Accordion styled>
        <Accordion.Title active={activeIndex === 0} index={0}>
          <div className='d-flex justify-content-between align-items-center'>
            <div className='d-flex justify-content-between align-items-center'>
              <img src="/assets/images/filter.png" alt="" />Filters
            </div>
            <div>
              <p className='fs-8 text-success'>Clear All</p>
            </div>
          </div>
          <div className='row mt-3 selectedFilter'>
            <div className='col-lg-4 col-md-6 col-sm-4'>
              <p className='fs-8 d-flex justify-content-between align-items-center p-1 mr-1 mb-1'>Building 1 <img src='/assets/images/wrong.svg' alt='Close' /></p>
            </div>
            <div className='col-lg-4 col-md-6 col-sm-4'>
              <p className='fs-8 d-flex justify-content-between align-items-center p-1 mr-1'>Small <img src='/assets/images/wrong.svg' alt='Close' /></p>
            </div>
            <div className='col-lg-4 col-md-6 col-sm-4'>
              <p className='fs-8 d-flex justify-content-between align-items-center p-1 mr-1'>10x9x9 <img src='/assets/images/wrong.svg' alt='Close' /></p>
            </div>
            <div className='col-lg-4 col-md-6 col-sm-4'>
              <p className='fs-8 d-flex justify-content-between align-items-center p-1 mr-1'>Amenity 1 <img src='/assets/images/wrong.svg' alt='Close' /></p>
            </div>
          </div>
        </Accordion.Title>

        <Accordion.Title className='d-flex justify-content-between align-items-center'
          active={activeIndex === 1}
          index={1}
          onClick={this.handleClick}
        >
          <div className='d-flex justify-content-between align-items-center'>
            <img src="/assets/images/building.png" alt="" />Building
          </div>
          <div>
            <img src="/assets/images/arrow-down.png" alt="" />
          </div>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
        <div>
            <h6 className='fw-600 mb-1'>SMALL</h6>
            <ul>
              <li><input className='mr-1 mb-1' type="checkbox" />10x8x8</li>
              <li><input className='mr-1 mb-1' type="checkbox" />10x9x9</li>
              <li><input className='mr-1 mb-1' type="checkbox" />10x8x8</li>
              <li><input className='mr-1 mb-1' type="checkbox" />10x9x9</li>
              <li><input className='mr-1 mb-1' type="checkbox" />10x8x8</li>
              <li><input className='mr-1 mb-1' type="checkbox" />10x9x9</li>
            </ul>
            <a href="javascript:void(0)" className='text-success text-right d-block'>MORE</a>
            </div>
        </Accordion.Content>

        <Accordion.Title className='d-flex justify-content-between align-items-center'
          active={activeIndex === 2}
          index={2}
          onClick={this.handleClick}
        >
          <div className='d-flex justify-content-between align-items-center'>
            <img src="/assets/images/unit-type.png" alt="" />Unit Type
          </div>
          <div>
          <img src="/assets/images/arrow-down.png" alt="" />
          </div>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
        <div>
              <h6 className='fw-600 mb-1'>LARGE</h6>
              <div className='text-success text-right'>
                <a href="/">Select All</a> | <a href="/">Clear All</a>
              </div>
                <ul>
                  <li><input className='mr-1 mb-1' type="checkbox" />Small</li>
                  <li><input className='mr-1 mb-1' type="checkbox" />Medium</li>
                  <li><input className='mr-1 mb-1' type="checkbox" />Large</li>
                </ul>
            </div>
        </Accordion.Content>

        <Accordion.Title className='d-flex justify-content-between align-items-center'
          active={activeIndex === 3}
          index={3}
          onClick={this.handleClick}
        >
          <div className='d-flex justify-content-between align-items-center'>
            <img src="/assets/images/dimensions.png" alt="" />Dimensions
          </div>
          <div>
          <img src="/assets/images/arrow-down.png" alt="" />
          </div>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 3}>
          <div>
            <h6 className='fw-600 mb-1'>SMALL</h6>
            <ul>
              <li><input className='mr-1 mb-1' type="checkbox" />10x8x8</li>
              <li><input className='mr-1 mb-1' type="checkbox" />10x9x9</li>
              <li><input className='mr-1 mb-1' type="checkbox" />10x8x8</li>
              <li><input className='mr-1 mb-1' type="checkbox" />10x9x9</li>
              <li><input className='mr-1 mb-1' type="checkbox" />10x8x8</li>
              <li><input className='mr-1 mb-1' type="checkbox" />10x9x9</li>
            </ul>
            <a href="javascript:void(0);" className='text-success text-right d-block' onClick={this.props.modal}>MORE</a>
            </div>
            <div>
              <h6 className='fw-600 mt-2 mb-1'>LARGE</h6>
              <ul>
                <li><input className='mr-1 mb-1' type="checkbox" />10x8x8</li>
                <li><input className='mr-1 mb-1' type="checkbox" />10x9x9</li>
                <li><input className='mr-1 mb-1' type="checkbox" />10x8x8</li>
                <li><input className='mr-1 mb-1' type="checkbox" />10x9x9</li>
                <li><input className='mr-1 mb-1' type="checkbox" />10x8x8</li>
                <li><input className='mr-1 mb-1' type="checkbox" />10x9x9</li>
              </ul>
              <a href="javascript:void(0);" className='text-success text-right d-block' onClick={this.props.modal}>MORE</a>
            </div>
        </Accordion.Content>

        <Accordion.Title className='d-flex justify-content-between align-items-center'
          active={activeIndex === 4}
          index={4}
          onClick={this.handleClick}
        >
          <div className='d-flex justify-content-between align-items-center'>
            <img src="/assets/images/price-range.png" alt="" />Price Range
          </div>
          <div>
          <img src="/assets/images/arrow-down.png" alt="" />
          </div>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 4}>
        <div> 
            <UnitsRangeSlider />
        </div>
        </Accordion.Content>

        <Accordion.Title className='d-flex justify-content-between align-items-center'
          active={activeIndex === 5}
          index={5}
          onClick={this.handleClick}
        >
          <div className='d-flex justify-content-between align-items-center'>
            <img src="/assets/images/amenity.png" alt="" />Amenity
          </div>
          <div>
          <img src="/assets/images/arrow-down.png" alt="" />
          </div>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 5}>
        <div>
            <h6 className='fw-600 mb-1'>SMALL</h6>
            <ul>
              <li><input className='mr-1 mb-1' type="checkbox" />10x8x8</li>
              <li><input className='mr-1 mb-1' type="checkbox" />10x9x9</li>
              <li><input className='mr-1 mb-1' type="checkbox" />10x8x8</li>
              <li><input className='mr-1 mb-1' type="checkbox" />10x9x9</li>
              <li><input className='mr-1 mb-1' type="checkbox" />10x8x8</li>
              <li><input className='mr-1 mb-1' type="checkbox" />10x9x9</li>
            </ul>
            <a href="/" className='text-success text-right d-block'>MORE</a>
            </div>
        </Accordion.Content>
      </Accordion>
    )
  }
}