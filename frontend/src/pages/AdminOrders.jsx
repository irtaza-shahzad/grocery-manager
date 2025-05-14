import React from 'react'
import AdminNav from '../components/AdminNav'
import AdminSidebar from '../components/AdminSidebar'
import AllOrders from '../components/AllOrders'
import { Box } from '@mui/material'
const AdminOrders = () => {
  return (
    <>
      <AdminNav></AdminNav>
<Box sx={{display:"flex"}}>
      <AdminSidebar/>
      <AllOrders/>
      </Box>
    </>
  )
}

export default AdminOrders
