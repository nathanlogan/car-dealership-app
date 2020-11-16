import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './Inventory.module.css'

import { sortBy, cloneDeep } from 'lodash'

import { Container, Header } from 'semantic-ui-react'
import InventoryList from 'components/InventoryList/InventoryList'
import Filters from 'components/Filters/Filters'

class Inventory extends Component {
  constructor(props) {
    super(props)

    this.state = {
      filteredCars: props.cars,

      allFilters: this.getAllFilters(),
      appliedFilters: [],
      
      sortDirection: 'ascending',
      sortColumn: null,

      currentPage: 1,
    }

    this.onSort = this.onSort.bind(this)
    this.onPageNav = this.onPageNav.bind(this)
    this.onFilter = this.onFilter.bind(this)
  }

  getAllFilters() {
    let keys = []
    let filters = {}

    // set up filter categories
    this.props.itemConfig.forEach(config => {
      if (config['filterType']) {
        filters[config.key] = []
        keys.push(config.key)
      }
    })

    // populate filter values
    this.props.cars.forEach(car => {
      keys.forEach(key => !filters[key].includes(car[key]) && filters[key].push(car[key]))
    })

    // sort filter values
    Object.keys(filters).forEach(key => (filters[key] = filters[key].sort()))

    return filters
  }

  getPagedResults() {
    const { carsPerPage } = this.props
    const { filteredCars, currentPage } = this.state

    return filteredCars.slice(
      carsPerPage * (currentPage - 1),
      carsPerPage * currentPage
    )
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
    let results = cloneDeep(this.state.filteredCars)

    if (sortColumn === newColumn) {
      const newSortDirection = sortDirection === 'ascending' ? 'descending' : 'ascending'
      results = this.doSort(results, newColumn, newSortDirection)

      this.setState({
        filteredCars: results,
        sortDirection: newSortDirection,
        currentPage: 1,
      })
    } else {
      results = this.doSort(results, newColumn)

      this.setState({
        filteredCars: results,
        sortDirection: 'ascending',
        sortColumn: newColumn,
        currentPage: 1,
      })
    }
  }

  onPageNav(page = 1) {
    this.setState(
      { currentPage: parseInt(page, 10) || 1 },
      () => window.scrollTo(0, 0)
    )
  }

  // apply "OR" logic within filter type, but "AND" logic across filter types
  onFilter(facet, values, type = 'select') {
    let results = cloneDeep(this.props.cars)
    let newAppliedFilters = []

    // nuke the old filter definition (if it existed)
    newAppliedFilters = this.state.appliedFilters.filter(filter => filter.facet !== facet)
    // only save our filter if it has values
    if (values.length) newAppliedFilters.push({ facet, values, type })

    // apply each filter type
    newAppliedFilters.forEach(filter => {
      if (filter.type === 'select') {
        results = results.filter(car => filter.values.includes(car[filter.facet]))
      } else {
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
      filteredCars: results,
      appliedFilters: newAppliedFilters,
      currentPage: 1,
    })
  }

  render() {
    const { filteredCars, allFilters, appliedFilters, sortColumn, sortDirection, currentPage } = this.state
    const pages = Math.ceil(filteredCars.length / this.props.carsPerPage)
    const carsToShow = this.getPagedResults()

    return (
      <Container className={styles.app}>
        <Header as="h1">Acme Car Dealership</Header>

        <Header as="h2">Filters:</Header>
        <Filters
          itemConfig={this.props.itemConfig}
          onFilter={this.onFilter}
          filters={allFilters}
          appliedFilters={appliedFilters}
        />

        <Header as="h3" data-testid="results">{filteredCars.length} results</Header>
        <InventoryList
          itemConfig={this.props.itemConfig}
          items={carsToShow}
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
  cars: PropTypes.array,
  itemConfig: PropTypes.array,
  carsPerPage: PropTypes.number
}

export default Inventory
