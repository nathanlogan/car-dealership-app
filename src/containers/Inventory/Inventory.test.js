import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Inventory from './Inventory'

const cars = [
  {
    "description": "Reprehenderit aute nisi amet ullamco dolor qui minim irure.",
    "color": "Yellow",
    "make": "Volkswagen",
    "highwayMileage": {
      "high": 25,
      "low": 19
    },
    "miles": 254906,
    "cityMileage": {
      "high": 21,
      "low": 15
    },
    "year": 2016,
    "model": "deserunt",
    "_id": "56b234de767ab2b2c08fc91a",
    "price": "$1,910"
  },
  {
    "description": "Ea ipsum ex Lorem labore et.",
    "color": "White",
    "make": "Cadillac",
    "highwayMileage": {
      "high": 22,
      "low": 19
    },
    "miles": 147125,
    "cityMileage": {
      "high": 17,
      "low": 14
    },
    "year": 1982,
    "model": "laborum",
    "_id": "56b234de4a272c283b7341c2",
    "price": "$15,226"
  },
]

const config = [
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

const carsPerPage = 3

it('displays correct number of results', () => {
  render(<Inventory cars={cars} itemConfig={config} carsPerPage={carsPerPage} />)
  expect(screen.getByTestId('results')).toHaveTextContent(cars.length)
})

it('displays correct number of rows', () => {
  render(<Inventory cars={cars} itemConfig={config} carsPerPage={carsPerPage} />)
  expect(document.querySelectorAll('tbody tr').length).toBe(Math.min(carsPerPage, cars.length))
})
