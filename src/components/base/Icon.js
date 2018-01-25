// @flow

import React from 'react'
import styled from 'styled-components'
import { fontSize, color } from 'styled-system'

const Container = styled.div`
  ${fontSize};
  ${color};
`

export default ({ name, ...props }: { name: string }) => (
  <Container {...props}>
    <i className={`fa fa-${name}`} />
  </Container>
)
