import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './Inventory.module.css'

import cars from 'store.json'

import { sortBy, cloneDeep } from 'lodash-es'

import { Container, Header } from "semantic-ui-react"
import InventoryList from 'components/InventoryList/InventoryList'
import Filters from 'components/Filters/Filters'

class Inventory extends Component {
  constructor(props) {
    super(props)

    this.numberOfCarsToShow = 50

    this.cars = cars
    this.state = {
      facetedCars: cars.slice(0),
      facetedPagedCars: cars.slice(0, this.numberOfCarsToShow),
      filters: [],
      sortDirection: 'ascending',
      sortColumn: null
    }

    this.itemConfig = [
      { key: 'year', sortable: true, filterType: 'range'},
      { key: 'make', sortable: true, filterType: 'select'},
      { key: 'model', sortable: true, filterType: 'select'},
      { key: 'miles', sortable: true, format: val => val.toLocaleString('en-us')},
      { key: 'price', sortable: true},
      { key: 'color', filterType: 'select'},
      { key: 'cityMileage', name: 'City MPG', format: obj => `${obj.low}-${obj.high}`},
      { key: 'highwayMileage', name: 'Highway MPG', format: obj => `${obj.low}-${obj.high}`},
      { key: 'description'},
    ]
    this.allFilters = this.getAllFilters()

    this.onSort = this.onSort.bind(this)
    this.filter = this.filter.bind(this)
  }

  getAllFilters() {
    let keys = []
    let filters = {}
    
    // set up filter categories
    this.itemConfig.forEach(config => {
      if (config['filterType']) {
        filters[config.key] = []
        keys.push(config.key)
      }
    })

    // populate filter values
    this.cars.forEach(car => {
      keys.forEach(key => !filters[key].includes(car[key]) && filters[key].push(car[key]))
    })

    // sort filter values
    Object.keys(filters).forEach(key => filters[key] = filters[key].sort())

    return filters
  }

  doSort(results, sortColumn, sortDirection = 'ascending') {
    return sortDirection === 'ascending' ? sortBy(results, [sortColumn]) : results.reverse()
  }

  onSort(newColumn) {
    const { sortColumn, sortDirection } = this.state
    let results = cloneDeep(this.state.facetedCars)
  
    if (sortColumn === newColumn) {
      results.reverse()
      this.setState({
        facetedCars: results,
        facetedPagedCars: results.slice(0, this.numberOfCarsToShow),
        sortDirection: sortDirection === 'ascending' ? 'descending' : 'ascending',
      })
    } else {
      // TODO: sort monetary values properly
      results = sortBy(results, [newColumn])
      this.setState({
        facetedCars: results,
        facetedPagedCars: results.slice(0, this.numberOfCarsToShow),
        sortDirection: 'ascending',
        sortColumn: newColumn,
      })
    }
  }

  // apply "OR" logic within filter type, but "AND" logic across filter types
  filter(facet, values, type = 'select') {
    let results = cloneDeep(this.cars)
    let filters = cloneDeep(this.state.filters)

    // nuke the old filter definition (if it existed)
    filters = filters.filter(filter => filter.facet !== facet)
    // only save our filter if it has values
    if (values.length) filters.push({ facet, values, type })

    // apply each filter type
    filters.forEach(filter => {
      if (filter.type === 'select') {
        results = results.filter(car => filter.values.includes(car[filter.facet]))
      }
      // else applyRangeFilter()
    })

    // apply current sort before returning
    if (this.state.sortColumn) {
      results = this.doSort(results, this.state.sortColumn, this.state.sortDirection)
    }

    this.setState({
      facetedCars: results,
      facetedPagedCars: results.slice(0, this.numberOfCarsToShow),
      filters
    })
  }

  // We would like you to build a website for a car dealership using HTML, CSS, and JavaScript.
  // build collections and models of this data
  // The vehicle listing should contain 50 vehicles per page and display all the attributes contained in the JSON file for each vehicle.
  // We'd like the ability to sort the data on the make, model, price, odometer reading (miles), and year of the vehicles.
  //  - TODO: sort on price
  // We'd also like a mechanism to filter the displayed data by make, model, color, and range of years (e.g. 2010 to 2015).

  render() {
    const { facetedPagedCars, filters, sortColumn, sortDirection } = this.state

    return (
      <Container className={styles.app}>
        <Header as="h1">Car List Sample App</Header>
        <Filters itemConfig={this.itemConfig} filters={this.allFilters} onFilter={this.filter} />
        <Header as="h3">Results: <strong>{this.state.facetedCars.length}</strong></Header>
        <InventoryList
          itemConfig={this.itemConfig}
          items={facetedPagedCars}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={this.onSort}
        />
      </Container>
    )
  }
}

Inventory.propTypes = {
  data: PropTypes.array
}

export default Inventory
