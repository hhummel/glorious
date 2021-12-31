// Setup file that gets run at the beginning of jest tests. see jest.config.js setupFiles

// load global DOM document to use enzyme's mount()
require('jsdom-global/register')

// Import configure from enzyme
const { configure } = require('enzyme')
// Import react adaptor
const Adapter = require('enzyme-adapter-react-16')

// // Fixes Error: matchMedia not present, legacy browsers require a polyfill
if (window) {
  window.matchMedia = window.matchMedia || function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {}
    }
  }
}
// Configure enzyme to use adapter
configure({ adapter: new Adapter() })
