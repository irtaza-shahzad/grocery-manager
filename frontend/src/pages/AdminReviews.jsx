import React from 'react'
import AdminNav from '../components/AdminNav'
import AdminSidebar from '../components/AdminSidebar'
import AllReviews from '../components/AllReviews'
import { Box } from '@mui/material'
const AdminReviews = () => {
  return (
    <>
      <AdminNav></AdminNav>
<Box sx={{display:"flex"}}>
      <AdminSidebar/>
      <AllReviews/>
      </Box>
    </>
  )
}

export default AdminReviews
