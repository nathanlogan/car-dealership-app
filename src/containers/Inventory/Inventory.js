import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './Inventory.module.css'

import cars from 'store.json'

import { sortBy, cloneDeep } from 'lodash-es'

import { Container, Header } from 'semantic-ui-react'
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
      sortColumn: null,
      currentPage: 1,
    }

    this.itemConfig = [
      { key: 'year', name: 'Years', sortable: true, filterType: 'range' },
      { key: 'make', sortable: true, filterType: 'select' },
      { key: 'model', sortable: true, filterType: 'select' },
      {
        key: 'miles',
        sortable: true,
        format: val => val.toLocaleString('en-us'),
      },
      { key: 'price', sortable: true },
      { key: 'color', filterType: 'select' },
      {
        key: 'cityMileage',
        name: 'City MPG',
        format: obj => `${obj.low}-${obj.high}`,
      },
      {
        key: 'highwayMileage',
        name: 'Highway MPG',
        format: obj => `${obj.low}-${obj.high}`,
      },
      { key: 'description' },
    ]
    this.allFilters = this.getAllFilters()

    this.onSort = this.onSort.bind(this)
    this.onPageNav = this.onPageNav.bind(this)
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
    Object.keys(filters).forEach(key => (filters[key] = filters[key].sort()))

    return filters
  }

  doSort(results, sortColumn, sortDirection) {
    const sortCars = car => {
      let val = car[sortColumn]

      if (typeof val === 'string') {
        // coerce prices into sortable numbers
        if (val.substr(0, 1) === '$') {
          return parseFloat(val.replace(/[^\d]/g, ''))
        }
        // so you sort alphabetically, not by weird case-sensitivity sorting
        else return val.toLowerCase()
      } else return val
    }

    results = sortBy(results, sortCars)
    if (sortDirection === 'descending') results.reverse()

    return results
  }

  onSort(newColumn) {
    const { sortColumn, sortDirection } = this.state
    let results = cloneDeep(this.state.facetedCars)

    if (sortColumn === newColumn) {
      const newSortDirection = sortDirection === 'ascending' ? 'descending' : 'ascending'
      results = this.doSort(results, newColumn, newSortDirection)

      this.setState({
        facetedCars: results,
        facetedPagedCars: results.slice(0, this.numberOfCarsToShow),
        sortDirection: newSortDirection,
        currentPage: 1,
      })
    } else {
      results = this.doSort(results, newColumn)

      this.setState({
        facetedCars: results,
        facetedPagedCars: results.slice(0, this.numberOfCarsToShow),
        sortDirection: 'ascending',
        sortColumn: newColumn,
        currentPage: 1,
      })
    }
  }

  onPageNav(page) {
    page = parseFloat(page)
    let newSlice = this.state.facetedCars.slice(
      this.numberOfCarsToShow * (page - 1),
      this.numberOfCarsToShow * page
    )

    this.setState(
      {
        facetedPagedCars: newSlice,
        currentPage: page,
      },
      () => window.scrollTo(0, 0)
    )
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
      } else {
        console.log('filtering range')
        results = results.filter(
          car => car[filter.facet] >= filter.values[0] && car[filter.facet] <= filter.values[1]
        )
      }
    })

    // apply current sort before returning
    if (this.state.sortColumn) {
      results = this.doSort(results, this.state.sortColumn, this.state.sortDirection)
    }

    this.setState({
      facetedCars: results,
      facetedPagedCars: results.slice(0, this.numberOfCarsToShow),
      filters,
      currentPage: 1,
    })
  }

  render() {
    const { facetedCars, facetedPagedCars, sortColumn, sortDirection, currentPage } = this.state
    const pages = Math.ceil(facetedCars.length / this.numberOfCarsToShow)

    return (
      <Container className={styles.app}>
        <Header as="h1">Car List Sample App</Header>
        <Filters
          itemConfig={this.itemConfig}
          onFilter={this.filter}
          filters={this.allFilters}
          selectedFilters={this.state.filters}
        />
        <Header as="h3">{facetedCars.length} results</Header>
        <InventoryList
          itemConfig={this.itemConfig}
          items={facetedPagedCars}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={this.onSort}
          onPageNav={this.onPageNav}
          pages={pages}
          currentPage={currentPage}
        />
      </Container>
    )
  }
}

Inventory.propTypes = {
  data: PropTypes.array,
}

export default Inventory
