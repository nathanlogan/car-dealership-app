import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Inventory from './containers/Inventory/Inventory'
import * as serviceWorker from './serviceWorker'

import cars from 'store.json'

const styleLink = document.createElement('link')
styleLink.rel = 'stylesheet'
styleLink.href = '//cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css'
document.head.appendChild(styleLink)

const itemConfig = [
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

ReactDOM.render(
  <Inventory cars={cars} itemConfig={itemConfig} carsPerPage={50} />,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
