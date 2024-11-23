import React from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {

    const navigate = useNavigate()
  return (
    <div>
         <Button className="w-full" onClick={() => navigate("/tags")}>Tags</Button>
    </div>
  )
}

export default Sidebar