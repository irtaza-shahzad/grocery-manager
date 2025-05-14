import React from 'react';
import { NavLink } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemButton, ListItemText, Typography, Box } from '@mui/material';

const drawerWidth = 240;
const navbarHeight = 64;

const navItems = [
  { label: 'Products', path: '/admin/products' },
  { label: 'Orders', path: '/admin/orders' },
  { label: 'Recipe', path: '/admin/recipies' },
  { label: 'Carts', path: '/admin/carts' },
  { label: 'Reviews', path: '/admin/reviews' },
  { label: 'Insights', path: '/admin/insights' }
];

const AdminSidebar = () => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: navbarHeight,
        },
      }}
    >
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Menu
        </Typography>
        <List>
          {navItems.map((item) => (
            <ListItem disablePadding key={item.path}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                sx={{
                  '&.active': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '& .MuiListItemText-root': {
                      fontWeight: 'bold',
                    },
                  }
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;
