import React from 'react'
import { Popup } from 'semantic-ui-react'

const PopupExampleInverted = (props) => {
    return (
        <>
        <Popup
          trigger={props.img}
          content={props.tooltip}
          inverted
          position='bottom center'
          size='mini'
        />
      </>
    )
}

export default PopupExampleInverted