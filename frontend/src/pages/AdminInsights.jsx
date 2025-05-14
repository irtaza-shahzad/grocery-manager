import React from 'react'
import AdminNav from '../components/AdminNav'
import AdminSidebar from '../components/AdminSidebar'
import ProductInsights from '../components/ProductInsights'
import { Box } from '@mui/material'
const AdminInsights = () => {
    return (
        <>
            <AdminNav></AdminNav>
            <Box sx={{ display: "flex" }}>
                <AdminSidebar />
                <ProductInsights />
            </Box>

        </>
    )
}

export default AdminInsights
