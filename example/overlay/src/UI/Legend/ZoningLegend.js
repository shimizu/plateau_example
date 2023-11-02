import { Box, Divider, Typography } from '@mui/material'
import React from 'react'

import BlockLegend from './components/BlockItem'

import { zoning  } from '../../zoningConf.js'

const data = [
  {label:"test", color:"red"}
]


const zoningLegend = ({ }) => {
  return (
    <>
        <Box>
          <Divider />
          <Typography sx={{ mt: 1, fontSize: 12 }} color="text.secondary" gutterBottom>
            用途地域
          </Typography>
        {zoning.map((ld, i) => (
            <BlockLegend key={i} itemName={ld.label} color={ld.color} />
          ))}
        </Box>
    </>
  )
}

export default zoningLegend
