import React, { useState } from 'react'

const LoadingContext = React.createContext({ loading: false, setLoading: (status: boolean) => null })

// This context maintain 2 counters that can be used as a dependencies on other hooks to force a periodic refresh
const LoadingContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)

  return <LoadingContext.Provider value={{ loading, setLoading }}>{children}</LoadingContext.Provider>
}

export { LoadingContext, LoadingContextProvider }
