import React, { Component, useState } from 'react'
import { Accordion } from 'semantic-ui-react'
import UnitsRangeSlider from '../unitsrangeslider/UnitsRangeSlider'
import { useSelector, useDispatch } from 'react-redux';
let Buildingfilter;
let unitTypeFilter;
let UnitTypeDimension = [];
let PriceRange = [];
let NewPriceValue;
let AmenityFilter;
const AccordionExampleStyled = (selectedStorageType) => {

  const loading = useSelector(state => state.unitFilter.loading);
  const error = useSelector(state => state.unitFilter.error);
  const filters = useSelector(state => state.unitFilter.filters);
  const [activeIndex, setActiveIndex] = useState(0);
  const [filterSelectedName , setFilterSelectedName] = useState([]);
  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index
    setActiveIndex(newIndex);
  }
  function checkStoragePriceRange(PriceRangeArray, storageCategoryValue) {
    let PriceArray = [];
    PriceRangeArray.map((array) => {
      if (array.storageTypeId === storageCategoryValue) {
        PriceArray.push({ storageTypeId: array.storageTypeId, MinPrice: array.MinPrice, MaxPrice: array.MaxPrice })
      }
    });

    let minvalue = Math.min.apply(Math, PriceArray.map(function (o) { return o.MinPrice; }));
    if (minvalue == Infinity) {
      minvalue = 0;
    }
    let MaxValue = Math.max.apply(Math, PriceArray.map(function (o) { return o.MaxPrice; }));
    if (MaxValue == -Infinity) {
      MaxValue = 0;
    }
    NewPriceValue = {
      "minPrice": minvalue,
      "maxPrice": MaxValue,
    }
    sessionStorage.setItem("MinValue", minvalue);
    sessionStorage.setItem("MaxValue", MaxValue);
  }

  if (typeof filters !== 'undefined' && filters !== null && filters !== '' && typeof filters.building !== 'undefined' && filters.building !== null && filters.building !== "" && filters.building.length > 0 && selectedStorageType.storageTypeValue !== 'undefined' && selectedStorageType.storageTypeValue !== null) {
    Buildingfilter = filters.building.filter(i => i.storageTypeId === selectedStorageType.storageTypeValue);
  }
  if (typeof filters !== 'undefined' && filters !== null && filters !== '' && typeof filters.unitType !== 'undefined' && filters.unitType !== null && filters.unitType !== "" && filters.unitType.length > 0 && selectedStorageType.storageTypeValue !== 'undefined' && selectedStorageType.storageTypeValue !== null) {
    unitTypeFilter = filters.unitType.filter(i => i.storageTypeId === selectedStorageType.storageTypeValue);
    let result = unitTypeFilter.reduce(function (r, a) {
      r[a.unitTypeName] = r[a.unitTypeName] || [];
      r[a.unitTypeName].push(a);
      return r;
    }, Object.create(null));
    UnitTypeDimension = result;
  }

  if (typeof filters !== 'undefined' && filters !== null && filters !== '' && typeof filters.priceRangeValue !== 'undefined' && filters.priceRangeValue !== null && filters.priceRangeValue !== "" && filters.priceRangeValue.length > 0 && selectedStorageType.storageTypeValue !== 'undefined' && selectedStorageType.storageTypeValue !== null) {

    checkStoragePriceRange(filters.priceRangeValue,selectedStorageType.storageTypeValue );
  }
  if (typeof filters !== 'undefined' && filters !== null && filters !== '' && typeof filters.amenityValue !== 'undefined' && filters.amenityValue !== null && filters.amenityValue !== "" && filters.amenityValue.length > 0 && selectedStorageType.storageTypeValue !== 'undefined' && selectedStorageType.storageTypeValue !== null) {
    AmenityFilter = filters.amenityValue.filter(i => i.storageTypeId === selectedStorageType.storageTypeValue);
  }


  const storageTypeOptions = typeof filters !== 'undefined' && filters !== null && filters !== '' && typeof filters.storageType !== 'undefined' && filters.storageType !== null && filters.storageType !== "" && filters.storageType.length > 0 ?
    filters.storageType.map(storageType => {
      return {
        key: storageType.storageTypeId,
        text: storageType.storageTypeName,
        value: storageType.storageTypeId
      }
    }) : '';

  const onFilterChange = (e,name) => {
    let filters = []
    if (e.target.checked) {
      filters.push(e.target.value);
    }
    setFilterSelectedName(name);

  }

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
        onClick={handleClick}
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
          <h6 className='fw-600 mb-1'>Building</h6>
          <ul>
            {typeof filters !== 'undefined' && filters !== null && filters !== '' && typeof filters.building !== 'undefined' && filters.building !== null && filters.building !== "" && filters.building.length > 0 ?
              Buildingfilter.map(buildingVal => {
                return <li key={buildingVal.key}><input value={buildingVal.buildingId} className='mr-1 mb-1' type="checkbox" onChange={(e)=>onFilterChange(e,buildingVal.buildingName)} />{buildingVal.buildingName}</li>
              })
              : ''}
          </ul>
          {typeof filters.building !== 'undefined' && filters.building !== null && filters.building !== '' && filters.building.length > 5 ? (
            <a className='text-success text-right d-block' href='/'>MORE</a>
          ) : ''}
        </div>
      </Accordion.Content>

      <Accordion.Title className='d-flex justify-content-between align-items-center'
        active={activeIndex === 2}
        index={2}
        onClick={handleClick}
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
            {typeof filters !== 'undefined' && filters !== null && filters !== '' && typeof filters.unitType !== 'undefined' && filters.unitType !== null && filters.unitType !== "" && filters.unitType.length > 0 ?
              unitTypeFilter.map(unitTypeValue => {
                return <li key={unitTypeValue.key}><input value={unitTypeValue.unitTypeId} className='mr-1 mb-1' type="checkbox" onChange={onFilterChange} />{unitTypeValue.unitTypeName}</li>

              })
              : ''}

          </ul>
        </div>
      </Accordion.Content>

      <Accordion.Title className='d-flex justify-content-between align-items-center'
        active={activeIndex === 3}
        index={3}
        onClick={handleClick}
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
          <ul>
            {typeof filters !== 'undefined' && filters !== null && filters !== '' && typeof UnitTypeDimension !== 'undefined' && UnitTypeDimension !== null && UnitTypeDimension !== "" ?
              Object.keys(UnitTypeDimension).map(data => {
                console.log('check dimension')
                return UnitTypeDimension[data].map(dimension => {
                  return <li key={dimension.key}><input value={dimension.unitTypeId} className='mr-1 mb-1' type="checkbox" onChange={onFilterChange} />{dimension.unitMeasurement}</li>
                })


              })
              : ''}

          </ul>
          {/* onClick={this.props.modal} */}
          <a href="javascript:void(0);" className='text-success text-right d-block' >MORE</a>
        </div>
      </Accordion.Content>

      <Accordion.Title className='d-flex justify-content-between align-items-center'
        active={activeIndex === 4}
        index={4}
        onClick={handleClick}
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
          <UnitsRangeSlider priceRange={NewPriceValue}  />
        </div>
      </Accordion.Content>

      <Accordion.Title className='d-flex justify-content-between align-items-center'
        active={activeIndex === 5}
        index={5}
        onClick={handleClick}
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
         
          <ul>
          {typeof filters !== 'undefined' && filters !== null && filters !== '' && typeof AmenityFilter !== 'undefined' && AmenityFilter !== null && AmenityFilter !== "" && AmenityFilter.length > 0 ?
              AmenityFilter.map(amenityfilterValue => {
                return <li key={amenityfilterValue.key}><input value={amenityfilterValue.id} className='mr-1 mb-1' type="checkbox" onChange={onFilterChange} />{amenityfilterValue.name}</li>
             

              })
              : ''}
            
          </ul>
          <a href="/" className='text-success text-right d-block'>MORE</a>
        </div>
      </Accordion.Content>
    </Accordion>
  )
}

export default AccordionExampleStyled;
