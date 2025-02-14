import React from 'react'
import { Appbar } from '../components/Appbar'
import { Balance } from '../components/Balance'
import { Users } from '../components/Users'
import Sidebar from '../components/Sidebar'

function Dashboard() {

  return (
    <div>
      {/* <Sidebar/> */}
      <Appbar/>
      <div className="m-8">
            <Balance value={"100"} />
            <Users/>
        </div>
    </div>
  )
}

export default Dashboard
