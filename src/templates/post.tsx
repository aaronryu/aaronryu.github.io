import * as React from 'react'

export default function Post({ ...data }) {
  console.log(data)
  return (
    <React.Fragment>
      <div>Test</div>
    </React.Fragment>
  )
}