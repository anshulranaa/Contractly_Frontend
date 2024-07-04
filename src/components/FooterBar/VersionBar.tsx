import React from 'react'

import { Space } from 'antd'
export interface VersionBarProps {
  className?: string
}
const VersionBar = (props: VersionBarProps) => {
  const { className } = props
  return (<>
  Developed by <a href ="https://www.linkedin.com/in/anshulrana20/"> Anshul Rana</a></>)
}

export default VersionBar
