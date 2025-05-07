import { AdminViewServerProps } from 'payload'
import React from 'react'

function TestDashboard(props:AdminViewServerProps) {
console.log(props);

  return (
    <div>
      {JSON.stringify(props.user)}
      {JSON.stringify(props.visibleEntities)}
      {/* {JSON.stringify(props.globalData)} */}
      {/* {JSON.stringify(props.navGroups)} */}
    </div>
  )
}

export default TestDashboard