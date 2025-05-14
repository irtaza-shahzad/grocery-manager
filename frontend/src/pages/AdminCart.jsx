import React from 'react'
import AdminNav from '../components/AdminNav'
import AdminSidebar from '../components/AdminSidebar'
import AllCarts from '../components/AllCarts'
import { Box } from '@mui/material'
const AdminCart = () => {
    return (
        <>
            <AdminNav></AdminNav>
            <Box sx={{ display: "flex",gap:"10px" }}>
                <AdminSidebar />
                <AllCarts />
            </Box>
        </>
    )
}

export default AdminCart
