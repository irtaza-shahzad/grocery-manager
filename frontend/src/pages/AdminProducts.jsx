import React from 'react'
import AdminNav from '../components/AdminNav'
import AdminSidebar from '../components/AdminSidebar'
import ProductsTable from '../components/ProductsTable'
import { Box } from '@mui/material'
const AdminProducts = () => {
  return (
    <>
      <AdminNav></AdminNav>
<Box sx={{display:"flex"}}>
      <AdminSidebar/>
      <ProductsTable/>
      </Box>
      
    </>
  )
}

export default AdminProducts
