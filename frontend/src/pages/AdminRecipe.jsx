import React from 'react'
import AdminNav from '../components/AdminNav'
import AdminSidebar from '../components/AdminSidebar'
import AllRecipes from '../components/AllRecipes'
import { Box } from '@mui/material'
const AdminRecipe = () => {
  return (
    <>
      <AdminNav></AdminNav>
<Box sx={{display:"flex"}}>
      <AdminSidebar/>
      <AllRecipes/>
      </Box>
    </>
  )
}

export default AdminRecipe
