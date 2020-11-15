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

ReactDOM.render(
  <Inventory cars={cars} />,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
