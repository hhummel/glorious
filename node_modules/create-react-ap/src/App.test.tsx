import * as React from 'react'
import { mount } from 'enzyme'

import App from './App'

describe('<App />', () => {
  it('renders', () => {
    mount(<App />)
  })
})
