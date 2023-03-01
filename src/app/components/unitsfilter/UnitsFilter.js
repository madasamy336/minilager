import { t } from 'i18next';
import React, { Component, useState, useEffect, useCallback, contextObject } from 'react';
import {Accordion, Item, Popup, Grid, Segment, Placeholder } from 'semantic-ui-react'
import Helper from "../../helper";
import instance from '../../services/instance';
import request from '../../services/request';
import { useTranslation } from "react-i18next";
const helper = new Helper();
const AccordionExampleStyled = (props) => {
  console.log("props",props);
  const selectedStorageType = props.storageTypeValue || sessionStorage.getItem("storageTypeValue");
  const [loader, setLoading] = useState(props.loader || true)
  const filters = props.constructFilterValues ||JSON.parse(localStorage.getItem('Units'));
  const [filterBuilding, setFilterBuiding] = useState([]);
  const [filterUnitType, setFilterUnitType] = useState([]);
  const [filterDimensions, setFilterDimensions] = useState([]);
  const [PriceRangeArrayvalue, setPriceRangeArrayvalue] = useState();
  const [filterAmenity, setfilterAmenity] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectAll, setSelectAll] = useState(true);
  const [minPriceState, setMinPriceState] = useState();
  const [maxPriceState, setMaxPriceState] = useState();
  const [PriceRangeStatus, setPriceRangeStatus] = useState(true);
  const { t, i18n } = useTranslation();
  // const selectedBuildingIds = [];
  const [selectedBuildingIds, setSelectedBuildingIds] = useState([]);
  const [selectedUnitTypes, setSelectedUnitTypes] = useState('');
  const [buildingFilter, setBuildingFilter] = useState([]);
  const [unitTypeFilter, setUnitTypeFilter] = useState([]);
  const [unitTypeDimension, setUnitTypeDimension] = useState({});
  const [originalDimensions, setOriginalDimensions] = useState([]);
  const [newPriceValue, setNewPriceValue] = useState({
    minPrice: 0,
    maxPrice: 0,
  });
  const [amenityFilter, setAmenityFilter] = useState([]);
  // New Stated for filters
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index
    setActiveIndex(newIndex);
  }

  const pricerangeOnchangevalue = (data) => {
    setPriceRangeArrayvalue(data);
  }

  useEffect(() => {
    let locationId = localStorage.getItem('locationid');
    const fetchData = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };
      const buildingIdsParam = selectedBuildingIds.length > 0 ? `&BuildingId=${selectedBuildingIds.join(",")}` : "";
      const cacheKey = `unitFilters-${locationId}-${buildingIdsParam}`;

      try {
        let response = localStorage.getItem(cacheKey);
        if (!response) {
          response = await instance.get(
            request.unit_filters +
            `&LocationId=${locationId}${buildingIdsParam}`,
            config
          );
          localStorage.setItem(cacheKey, JSON.stringify(response));
        } else {
          response = JSON.parse(response);
        }

        if (
          Array.isArray(response.data.result) &&
          response.data.result.length > 0 &&
          response.data.result
        ) {
          console.log(response.data.result);
          const storageTypeFilter = response.data.result.find((i) => i.storageTypeId === selectedStorageType);

          if (storageTypeFilter && Array.isArray(storageTypeFilter.unitTypes) && storageTypeFilter.unitTypes.length > 0) {
            const unitTypeFilter = storageTypeFilter.unitTypes;
            console.log("unitTypeFilter", unitTypeFilter);
            const unitTypesarr = Object.values(unitTypeFilter.reduce((acc, cur) => Object.assign(acc, { [cur.unitTypeName]: cur }), {}));
            const result = unitTypeFilter.reduce((r, a) => {
              r[a.unitTypeName] = r[a.unitTypeName] || [];
              r[a.unitTypeName].push(a);
              return r;
            }, Object.create(null));
            setUnitTypeFilter(unitTypesarr);
            setUnitTypeDimension(result);
          } else {
            console.log("No unit types found for selected storage type");
          }

        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [selectedBuildingIds]);




  function checkStoragePriceRange(PriceRangeArray, storageCategoryValue) {
    let PriceArray = [];
    PriceRangeArray.map((array) => {
      if (array.storageTypeId === storageCategoryValue) {
        PriceArray.push({ storageTypeId: array.storageTypeId, MinPrice: array.MinPrice, MaxPrice: array.MaxPrice })
      }
    });

    if (typeof PriceArray !== "undefined" && PriceArray !== null && PriceArray !== "" && PriceArray.length > 0) {
      let minvalue = Math.min.apply(Math, PriceArray.map(function (o) { return o.MinPrice; }));

      let maxValue = Math.max.apply(Math, PriceArray.map(function (o) { return o.MaxPrice; }));
      console.log("maxValue", maxValue);
      console.log("minvalue", minvalue);
      setNewPriceValue({
        minPrice: minvalue,
        maxPrice: maxValue
      });

      if (maxValue === minvalue) {
        let priceRangeHiding = document.getElementById("pricerange-hide");
        if (typeof priceRangeHiding !== "undefined" && priceRangeHiding !== null && priceRangeHiding !== "") {
          priceRangeHiding.style.display = 'none';
        }
      } else {
        let priceRangeHiding = document.getElementById("pricerange-hide");
        if (typeof priceRangeHiding !== "undefined" && priceRangeHiding !== null && priceRangeHiding !== "") {
          priceRangeHiding.style.display = 'block';
        }
      }
      sessionStorage.setItem("MinValue", minvalue);
      sessionStorage.setItem("MaxValue", maxValue);
    }
  }

useEffect(() => {
  console.log("filters -", filters);
  if (
    typeof selectedStorageType !== 'undefined' &&
    selectedStorageType !== null
  ) {
    setLoading(false); // Set loading to false if selectedStorageType has a value
    // Building filter
    if (
      typeof filters !== 'undefined' &&
      filters !== null &&
      filters !== '' &&
      typeof filters.building !== 'undefined' &&
      filters.building !== null &&
      filters.building !== "" &&
      filters.building.length > 0
    ) {
      console.log("buildingFilter passed", selectedStorageType);
      const buildingFilter = filters.building.filter(i => i.storageTypeId === selectedStorageType);
      setBuildingFilter(buildingFilter);
    }

    // Unit Type filter
    if (
      typeof filters !== 'undefined' &&
      filters !== null &&
      filters !== '' &&
      typeof filters.unitType !== 'undefined' &&
      filters.unitType !== null &&
      filters.unitType !== "" &&
      filters.unitType.length > 0
    ) {
      const unitTypeFilter = filters.unitType.filter(i => i.storageTypeId === selectedStorageType);
      let unitTypesarr = (Object.values(unitTypeFilter.reduce((acc, cur) => Object.assign(acc, { [cur.unitTypeName]: cur }), {})));
      console.log("unitTypesarr", unitTypesarr);
      let result = unitTypeFilter.reduce(function (r, a) {
        r[a.unitTypeName] = r[a.unitTypeName] || [];
        r[a.unitTypeName].push(a);
        return r;
      }, Object.create(null));
      setUnitTypeFilter(unitTypesarr);
      setUnitTypeDimension(result);
    }

    // Price Range filter
    if (
      typeof filters !== 'undefined' &&
      filters !== null &&
      filters !== '' &&
      typeof filters.priceRangeValue !== 'undefined' &&
      filters.priceRangeValue !== null &&
      filters.priceRangeValue !== "" &&
      filters.priceRangeValue.length > 0
    ) {
      const priceRangeValue = checkStoragePriceRange(filters.priceRangeValue, selectedStorageType);
      setNewPriceValue(priceRangeValue);
    }

    // Amenity filter
    if (
      typeof filters !== 'undefined' &&
      filters !== null &&
      filters !== '' &&
      typeof filters.amenityValue !== 'undefined' &&
      filters.amenityValue !== null &&
      filters.amenityValue !== "" &&
      filters.amenityValue.length > 0
    ) {
      const amenityFilter = filters.amenityValue.filter(i => i.storageTypeId === selectedStorageType);
      console.log("amenityFilter", amenityFilter);
      const uniqueAmenities = amenityFilter.filter((item, index, self) => index === self.findIndex(t => t.name === item.name));
      console.log("uniqueAmenities", uniqueAmenities);
      setAmenityFilter(uniqueAmenities);
    }
  } else {
    setLoading(true); // Set loading to true if selectedStorageType has no value
  }
  console.log("fetchData");
}, [props]);



  useEffect(() => {
    console.log("buildingFilter", buildingFilter);
    console.log("unitTypesarr", unitTypeFilter);
  }, [buildingFilter, unitTypeFilter]);

  const storageTypeOptions = typeof filters !== 'undefined' && filters !== null && filters !== '' && typeof filters.storageType !== 'undefined' && filters.storageType !== null && filters.storageType !== "" && filters.storageType.length > 0 ?
    filters.storageType.map(storageType => {
      return {
        key: storageType.storageTypeId,
        text: storageType.storageTypeName,
        value: storageType.storageTypeId
      }
    }) : '';

  const onChangeUnitMesurement = (e, unitMeasurement, unitTypeId) => {
    if (e.target.checked) {
      setFilterDimensions([...filterDimensions, { unitMeasurement: unitMeasurement, unitTypeid: unitTypeId }]);
    } else {
      setFilterDimensions((item) => item.filter((i) => i.unitTypeid !== unitTypeId));
    }
  };


  const selectAllBuilding = () => {
    setFilterBuiding([]);
    buildingFilter.forEach((item) => {
      setFilterBuiding((items) => [...items, { buildingname: item.buildingName, buildingid: item.buildingId }]);
    });
  }

  const selectAllUnitType = () => {
    setFilterUnitType([]);
    unitTypeFilter.forEach((item) => {
      setFilterUnitType((items) => [...items, { unitTypename: item.unitTypeName, unitTypeid: item.unitTypeId }]);
    });
  }

  const clearAllBuilding = () => {
    setFilterBuiding([]);
  }

  const clearAllUnitType = () => {
    setFilterUnitType([]);
  }


  const selectAllDimension = () => {
    setFilterDimensions([]);
    unitTypeFilter.forEach((item) => {
      setFilterDimensions((items) => [...items, { unitTypeid: item.unitTypeId, unitmesurement: item.unitMeasurement }]);
    });
  }

  const clearAllDimension = () => {
    setFilterDimensions([]);
  }


  const selectAllAmenityCheckbox = () => {
    setfilterAmenity([]);
    amenityFilter.forEach((item) => {
      setfilterAmenity((items) => [...items, { amenitiesname: item.name, amenitiesid: item.id }]);
    });
  }

  const clearAllAmenityCheckbox = () => {
    setfilterAmenity([]);
  }


  const onChangeBuilding = useCallback((e, buildingname, buildingid) => {
    if (e.target.checked) {
      setFilterBuiding([...filterBuilding, { buildingname, buildingid }]);
      setSelectedBuildingIds(prevIds => [...prevIds, buildingid]);
    } else {
      setFilterBuiding(filterBuilding.filter(b => b.buildingid !== buildingid));
      setSelectedBuildingIds(prevIds => prevIds.filter(id => id !== buildingid));
    }
  }, [filterBuilding]);

  const onChangeUnitType = useCallback((e, unitTypeName, unitTypeId) => {
    if (e.target.checked) {
      setSelectedUnitTypes(unitTypeName);
      setFilterUnitType([...filterUnitType, { unitTypename: unitTypeName, unitTypeid: unitTypeId }]);
    } else {
      setSelectedUnitTypes('');
      setFilterDimensions(filterDimensions.filter((i) => i.unitTypeid !== unitTypeId));
      setFilterUnitType((item) => item.filter((i) => i.unitTypeid !== unitTypeId));
    }
  }, [filterUnitType]);

  const dimensions = unitTypeFilter.reduce((acc, curr) => {
    if (selectedUnitTypes.includes(curr.unitTypeName)) {
      const unitTypeDimensions = unitTypeDimension[curr.unitTypeName];
      acc.push(...unitTypeDimensions.map((dim) => ({
        ...dim,
        unitTypeName: curr.unitTypeName,
        unitTypeId: curr.unitTypeId,
      })));
    }
    return acc;
  }, []);

  useEffect(() => {
    // Prepopulate filterDimensions with selected dimensions from filters
    if (filters && filters.length > 0) {
      const selectedDimensions = filters.filter((item) => item.dimension !== undefined);
      setFilterDimensions(selectedDimensions);
    }
  }, [filters]);




  const sixStorageOnChangeAmenity = (e, amenitiesName, amenitiesId) => {
    if (e.target.checked === true) {
      setfilterAmenity([...filterAmenity, { amenitiesname: amenitiesName, amenitiesid: amenitiesId }]);
    } else {
      setfilterAmenity((items) => items.filter((i) => i.amenitiesid !== amenitiesId));
    }
  }


  const removeBuilding = (buildingid) => {
    setFilterBuiding((item) => item.filter((i) => i.buildingid !== buildingid));
  }
  const removeUnitType = (unitTypeId) => {
    setFilterUnitType((item) => item.filter((i) => i.unitTypeid !== unitTypeId));
  }

  const removeUnitDimension = (unitTypeId) => {
    setFilterDimensions((item) => item.filter((i) => i.unitTypeid !== unitTypeId));
  }

  const removeAmenities = (amenitiesId) => {
    setfilterAmenity((item) => item.filter((i) => i.amenitiesid !== amenitiesId));
  }
  const clearAllFilters = () => {
    setFilterBuiding([]);
    setFilterUnitType([]);
    setFilterDimensions([]);
    setfilterAmenity([]);
    setPriceRangeArrayvalue([]);
    setMaxPriceState(0);
    setMinPriceState(0);
  }

  function arrayUnique(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j])
          a.splice(j--, 1);
      }
    }

    return a;
  }


  const applyAllFiterValues = () => {
    let selectedbuildingId;
    let selectedUnitTypeId = [];
    let selectedAmenitiesId;
    let selectedDimension = [];

    if (typeof filterBuilding !== "undefined" && filterBuilding !== "" && filterBuilding !== null) {
      selectedbuildingId = filterBuilding.filter((i) => i.buildingid).map((item) => {
        return item.buildingid;
      });
    }

    if (typeof filterUnitType !== "undefined" && filterUnitType !== "" && filterUnitType !== null) {
      selectedUnitTypeId = filterUnitType.filter((i) => i.unitTypeid).map((item) => {
        return item.unitTypeid;
      });
    }

    if (typeof filterAmenity !== "undefined" && filterAmenity !== "" && filterAmenity !== null) {
      selectedAmenitiesId = filterAmenity.filter((i) => i.amenitiesid).map((item) => {
        return item.amenitiesid;
      });
    }

    if (typeof filterDimensions !== "undefined" && filterDimensions !== "" && filterDimensions !== null) {
      filterUnitType.forEach((i) => {
        filterDimensions.forEach((j) => {
          if (i.unitTypeid === j.unitTypeid) {
            selectedDimension.push(j.unitTypeid);
          }
        })
      });
    }

    let FilterSearchId = {
      buildingid: selectedbuildingId,
      unitTypeid: selectedUnitTypeId.concat(selectedDimension),
      amenitiesid: selectedAmenitiesId,
      priceRange: newPriceValue
    };

    console.log("FilterSearchId", FilterSearchId);
    props.unitsearchFilters(FilterSearchId);
  }


  if (loader) {
    return (
      <Grid className='px-1' columns={1} stackable>
        <Grid.Column>
          <Segment raised>
            <Placeholder>
              <Placeholder.Paragraph>
                <Placeholder.Line length='medium' />
                <Placeholder.Line length='short' />
                <Placeholder.Line length='medium' />
                <Placeholder.Line length='short' />
              </Placeholder.Paragraph>
              <Placeholder.Paragraph>
                <Placeholder.Line length='medium' />
                <Placeholder.Line length='short' />
                <Placeholder.Line length='medium' />
                <Placeholder.Line length='short' />
              </Placeholder.Paragraph>
              <Placeholder.Paragraph>
                <Placeholder.Line length='medium' />
                <Placeholder.Line length='short' />
                <Placeholder.Line length='medium' />
                <Placeholder.Line length='short' />
              </Placeholder.Paragraph>
            </Placeholder>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }

  return (

    <Accordion styled>
      <Accordion.Title active={activeIndex === 0} index={0}>
        <div className='d-flex justify-content-between align-items-center'>
          <div className='d-flex justify-content-between align-items-center'>
            <img src="/assets/images/filter.png" alt="" />{t("Filters")}
          </div>
          <div>
            <p className='fs-8 text-success' onClick={() => clearAllFilters()}>{t("Clear All")}</p>
          </div>
        </div>
        <div className='row mt-3 selectedFilter'>

          {typeof filterBuilding !== "undefined" && filterBuilding !== null && filterBuilding !== "" && filterBuilding.length > 0 ?
            filterBuilding.map((item) => {
              return <div key={item.buildingid} className='col-lg-4 col-md-6 col-sm-4'>
                <p key={item.buildingid} className='fs-8 d-flex justify-content-between align-items-center p-1 mr-1 mb-1'>{item.buildingname}<a onClick={() => removeBuilding(item.buildingid)}><img src='/assets/images/wrong.svg' alt='Close' /></a></p>
              </div>
            }) : ""}


          {typeof filterUnitType !== "undefined" && filterUnitType !== null && filterUnitType !== "" && filterUnitType.length > 0 ?
            filterUnitType.map((item) => {
              return <div key={item.unitTypeid} className='col-lg-4 col-md-6 col-sm-4'>
                <p key={item.unitTypeid} className='fs-8 d-flex justify-content-between align-items-center p-1 mr-1'>{item.unitTypename}<a onClick={() => removeUnitType(item.unitTypeid)}><img src='/assets/images/wrong.svg' alt='Close' /></a></p>
              </div>

            }) : ""}


          {typeof filterDimensions !== "undefined" && filterDimensions !== "" && filterDimensions !== null && filterDimensions.length > 0 ?
            filterDimensions.map((item) => (
              <div key={item.unitTypeId} className='col-lg-4 col-md-6 col-sm-4'>
                <p className='fs-8 d-flex justify-content-between align-items-center p-1 mr-1'>{item.unitMeasurement}<a onClick={() => setFilterDimensions((prevState) => prevState.filter((i) => i.unitTypeId !== item.unitTypeId))}><img src='/assets/images/wrong.svg' alt='Close' /></a></p>
              </div>
            )) : ""
          }

          {typeof filterAmenity !== "undefined" && filterAmenity !== "" && filterAmenity !== null && filterAmenity.length > 0 ?
            filterAmenity.map((item) => {
              return <div key={item.amenitiesid} className='col-lg-4 col-md-6 col-sm-4'>
                <p key={item.amenitiesid} className='fs-8 d-flex justify-content-between align-items-center p-1 mr-1'>{item.amenitiesname}<a onClick={() => removeAmenities(item.amenitiesid)}><img src='/assets/images/wrong.svg' alt='Close' /></a></p>
              </div>
            }) : ""

          }
        </div>
      </Accordion.Title>

      <Accordion.Title className='d-flex justify-content-between align-items-center'
        active={activeIndex === 1}
        index={1}
        onClick={handleClick}
      >
        <div className='d-flex justify-content-between align-items-center'>
          <img src="/assets/images/building.png" alt="" />{t("Building")}
        </div>
        <div>
          <img src="/assets/images/arrow-down.png" alt="" />
        </div>
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 1}>
        <div>
          {/* <h6 className='fw-600 mb-1'>Building</h6> */}
          <div className='text-success text-right'>
            {selectAll ? <a onClick={() => selectAllBuilding()} >{t("Select All")}</a> : ""} | <a onClick={() => clearAllBuilding()}>{t("Clear All")}</a>
          </div>
          <ul>
            {buildingFilter.length > 0 && buildingFilter.map(buildingVal => {
              return (
                <li key={buildingVal.key}>
                  <input
                    key={buildingVal.key}
                    value={buildingVal.buildingId}
                    id={buildingVal.buildingId}
                    className='mr-1 mb-1'
                    type="checkbox"
                    checked={filterBuilding.find((item) => item.buildingid === buildingVal.buildingId)}
                    onChange={(e) => onChangeBuilding(e, buildingVal.buildingName, buildingVal.buildingId)}
                  />
                  {buildingVal.buildingName}
                </li>
              )
            })}
          </ul>
          {typeof buildingFilter !== 'undefined' && buildingFilter !== null && buildingFilter !== '' && buildingFilter.length > 5 ? (
            <a className='text-success text-right d-none' href='/'>MORE</a>
          ) : ''}
        </div>
      </Accordion.Content>
      <Accordion.Title className='d-flex justify-content-between align-items-center'
        active={activeIndex === 2}
        index={2}
        onClick={handleClick}
      >
        <div className='d-flex justify-content-between align-items-center'>
          <img src="/assets/images/unit-type.png" alt="" />{t("Unit Type")}
        </div>
        <div>
          <img src="/assets/images/arrow-down.png" alt="" />
        </div>
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 2}>
        <div>
          {/* <h6 className='fw-600 mb-1'>LARGE</h6> */}
          <div className='text-success text-right'>
            {selectAll ? <a onClick={() => selectAllUnitType()}>{t("Select All")}</a> : ""}  | <a onClick={() => clearAllUnitType()}>{t("Clear All")}</a>
          </div>
          <ul>
            {console.log("unitTypeFilter UI", unitTypeFilter)}
            {Array.isArray(unitTypeFilter) && unitTypeFilter.length > 0 && typeof filters !== 'undefined' && filters !== null && filters !== '' && typeof filters.unitType !== 'undefined' && filters.unitType !== null && filters.unitType !== "" && filters.unitType.length > 0 ?
              unitTypeFilter.map(unitTypeValue => {
                return (
                  <li key={unitTypeValue.unitTypeId}>
                    <input
                      key={unitTypeValue.unitTypeId}
                      value={unitTypeValue.unitTypeId}
                      checked={filterUnitType.some(item => item.unitTypeid === unitTypeValue.unitTypeId)}
                      className='mr-1 mb-1'
                      type="checkbox"
                      onChange={(e) => onChangeUnitType(e, unitTypeValue.unitTypeName, unitTypeValue.unitTypeId)}
                    />
                    {unitTypeValue.unitTypeName}
                  </li>
                )
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
          <img src="/assets/images/dimensions.png" alt="" />{t("Dimensions")}
        </div>
        <div>
          <img src="/assets/images/arrow-down.png" alt="" />
        </div>
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 3}>
        <div>
          <div className='text-success text-right'>
            {selectAll ? <a onClick={() => selectAllDimension()}>{t("Select All")}</a> : ""}  | <a onClick={() => clearAllDimension()} >{t("Clear All")}</a>
          </div>
          {Array.isArray(unitTypeFilter) && unitTypeFilter.length > 0 && filterUnitType.length > 0 ?
            filterUnitType.map(filterUnitTypeValue => {
              const unitTypeName = filterUnitTypeValue.unitTypename;
              const unitTypeId = filterUnitTypeValue.unitTypeid;
              const dimensions = unitTypeDimension[unitTypeName];
              const filterUnitMeasurement = filterDimensions.filter(item => item.unitTypeid === unitTypeId).map(item => item.unitMeasurement);
              return (
                <ul key={unitTypeId}>
                  {dimensions.map(dimension => (
                    <li key={dimension.key}>
                      <input
                        key={dimension.key}
                        value={dimension.unitTypeId}
                        className={`mr-1 mb-1 dimension_${unitTypeName.split(" ").join("").replace(/[&\\+()~%'",:?<>{}!@#]/g, '')}`}
                        type="checkbox"
                        onChange={(e) => onChangeUnitMesurement(e, dimension.unitMeasurement, dimension.unitTypeId)}
                        checked={filterUnitMeasurement.includes(dimension.unitMeasurement)}
                      />
                      {dimension.unitMeasurement}
                      {helper.measurementDisplayFormat(dimension.measurementType)}
                    </li>
                  ))}
                </ul>
              );
            })
            :
            unitTypeFilter.map(unitTypeValue => {
              const unitTypeName = unitTypeValue.unitTypeName;
              const unitTypeId = unitTypeValue.unitTypeId;
              const dimensions = unitTypeDimension[unitTypeName];
              const filterUnitMeasurement = filterDimensions.filter(item => item.unitTypeid === unitTypeId).map(item => item.unitMeasurement);
              return (
                <ul key={unitTypeId}>
                  {dimensions.map(dimension => (
                    <li key={dimension.key}>
                      <input
                        key={dimension.key}
                        value={dimension.unitTypeId}
                        className={`mr-1 mb-1 dimension_${unitTypeName.split(" ").join("").replace(/[&\\+()~%'",:?<>{}!@#]/g, '')}`}
                        type="checkbox"
                        onChange={(e) => onChangeUnitMesurement(e, dimension.unitMeasurement, dimension.unitTypeId)}
                        checked={filterUnitMeasurement.includes(dimension.unitMeasurement)}
                      />
                      {dimension.unitMeasurement}
                      {helper.measurementDisplayFormat(dimension.measurementType)}
                    </li>
                  ))}
                </ul>
              );
            })
          }

          <a href="javascript:void(0);" className='text-success text-right d-none' >MORE</a>
        </div>


      </Accordion.Content>

      {/* <div id="pricerange-hide">

        <Accordion.Title className='d-flex justify-content-between align-items-center'
          active={activeIndex === 4}
          index={4}
          onClick={handleClick}
        >
          <div className='d-flex justify-content-between align-items-center'>
            <img src="/assets/images/price-range.png" alt="" />{t("Price Range")}
          </div>
          <div>
            <img src="/assets/images/arrow-down.png" alt="" />
          </div>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 4}>
          <div>
          {newPriceValue?
          <UnitsRangeSlider priceRange={newPriceValue} minprice = {(min)=> setMinPriceState(min)} maxprice = {(max)=>setMaxPriceState(max)}  pricerangeinitialvalue={pricerangeOnchangevalue}/>
          : ""
          }
          </div>
        </Accordion.Content>

      </div> */}


      {
        typeof filters !== 'undefined' && filters !== null && filters !== '' && typeof amenityFilter !== 'undefined' && amenityFilter !== null && amenityFilter !== "" && amenityFilter.length > 0 ?
          <><Accordion.Title className={`d-flex justify-content-between align-items-center`}
            active={activeIndex === 5}
            index={5}
            onClick={handleClick}
          >
            <div className={`d-flex justify-content-between align-items-center `}>
              <img src="/assets/images/amenity.png" alt="" />{t("Amenity")}
            </div>
            <div>
              <img src="/assets/images/arrow-down.png" alt="" />
            </div>
          </Accordion.Title>
            <Accordion.Content active={activeIndex === 5}>
              <div>

                <div className='text-success text-right'>
                  {selectAll ? <a onClick={() => selectAllAmenityCheckbox()} >{t("Select All")}</a> : ""} | <a onClick={() => clearAllAmenityCheckbox()}>{t("Clear All")}</a>
                </div>

                <ul>
                  {typeof filters !== 'undefined' && filters !== null && filters !== '' && typeof amenityFilter !== 'undefined' && amenityFilter !== null && amenityFilter !== "" && amenityFilter.length > 0 ?
                    amenityFilter.map(amenityfilterValue => {
                      return <li key={amenityfilterValue.key}><input key={amenityfilterValue.key} value={amenityfilterValue.id} checked={filterAmenity.find((item) => item.amenitiesid === amenityfilterValue.id)} className='mr-1 mb-1' type="checkbox" onChange={(e) => sixStorageOnChangeAmenity(e, amenityfilterValue.name, amenityfilterValue.id)} />{amenityfilterValue.name}</li>
                    })
                    : ''}
                </ul>
                <a href="/" className='text-success text-right d-none'>MORE</a>
              </div>
            </Accordion.Content></>
          : ''
      }

      <div className='text-center my-2'>
        <button className='ui button bg-white border-success-dark-light-1 text-success fs-7 fw-400 px-5 mx-1 mb-1 mb-sm-1 px-sm-2' onClick={() => clearAllFilters()}>{t("Clear All")}</button>
        <button className='ui button bg-success-dark text-white fs-7 fw-400 px-5 mx-1 mb-1 mb-sm-1 px-sm-2' onClick={() => applyAllFiterValues()} >{t("Apply")}</button>
      </div>
    </Accordion >


  )
}

export default AccordionExampleStyled;
