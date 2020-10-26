import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './Inventory.module.css'

import cars from 'store.json'

import { sortBy } from 'lodash-es'

import { Container, Header } from "semantic-ui-react"
import InventoryList from 'components/InventoryList/InventoryList'
import Filters from 'components/Filters/Filters'

class Inventory extends Component {
  constructor(props) {
    super(props)

    this.numberOfCarsToShow = 50
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

    this.state = {
      allCars: cars,
      displayedCars: cars.slice(0, this.numberOfCarsToShow),
      filters: {},
      sortDirection: 'ascending',
      sortColumn: null
    }

    this.sort = this.sort.bind(this)
    this.filter = this.filter.bind(this)
  }

  componentDidMount() {
    this.getFilterParameters()
  }

  getFilterParameters() {
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
    this.state.allCars.forEach(car => {
      keys.forEach(key => !filters[key].includes(car[key]) && filters[key].push(car[key]))
    })

    // sort filter values
    Object.keys(filters).forEach(key => filters[key] = filters[key].sort())

    this.setState({filters})
  }

  sort(newColumn) {
    const { allCars, sortColumn, sortDirection } = this.state
    let clone = JSON.parse(JSON.stringify(allCars))
  
    if (sortColumn === newColumn) {
      clone.reverse()
      this.setState({
        allCars: clone,
        displayedCars: clone.slice(0, this.numberOfCarsToShow),
        sortDirection: sortDirection === 'ascending' ? 'descending' : 'ascending',
      })
    } else {
      clone = sortBy(clone, [newColumn])
      this.setState({
        allCars: clone,
        displayedCars: clone.slice(0, this.numberOfCarsToShow),
        sortDirection: 'ascending',
        sortColumn: newColumn,
      })
    }
  }

  filter() {

  }

  // We would like you to build a website for a car dealership using HTML, CSS, and JavaScript.
  // build collections and models of this data
  // The vehicle listing should contain 50 vehicles per page and display all the attributes contained in the JSON file for each vehicle.
  // We'd like the ability to sort the data on the make, model, price, odometer reading (miles), and year of the vehicles.
  //  - TODO: sort on price
  // We'd also like a mechanism to filter the displayed data by make, model, color, and range of years (e.g. 2010 to 2015).

  render() {
    const { displayedCars, filters, sortColumn, sortDirection } = this.state

    return (
      <Container className={styles.app}>
        <Header as="h1">Car List Sample App</Header>
        <Filters itemConfig={this.itemConfig} filters={filters} onFilter={this.filter} />
        <InventoryList
          itemConfig={this.itemConfig}
          items={displayedCars}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={this.sort}
        />
      </Container>
    )
  }
}

Inventory.propTypes = {
  data: PropTypes.array
}

export default Inventory
