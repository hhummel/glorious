import * as React from 'react'

export type AppProps = {
  message?: string
}

const App = ({ message }: AppProps): React.ReactElement => {
  return (
    <div className='app'>
      <h1 style={{
        color: 'gold',
        position: 'relative',
        top: '50%',
        transform: 'translateY(-50%)',
        textAlign: 'center'
      }}>
        {message}
      </h1>
    </div>
  )
}
export default App
