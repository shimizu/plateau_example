import { Box, Typography } from '@mui/material'
import React from 'react'


const BlockLegend = ({ itemName, color }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'left',
        height: '12px',
        mt: 1,
        mb: 1
      }}
    >
      <Box
        sx={{
          width: 16,
          height: 16,
          backgroundColor: color
        }}
      ></Box>
      <Typography
        sx={{
          fontSize: 9,
          ml: 1,
          mb: 0,
          mt: 0
        }}
        color="text.secondary"
        gutterBottom
      >
        {itemName}
      </Typography>
    </Box>
  )
}

export default BlockLegend
