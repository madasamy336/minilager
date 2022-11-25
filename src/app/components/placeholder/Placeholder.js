import React, { useEffect, useState } from 'react'
import { Grid, Placeholder, Segment } from 'semantic-ui-react'

export default function PlaceholderLoader({cardCount}) {
    const [loopcard]=useState([]);
    useEffect(()=>{
        loopcard.splice(0,loopcard.length)
        for(let i=0;i<=cardCount;i++){
          loopcard.push(i)
        }

    },[cardCount])
  return (
    <Grid className='px-1' columns={3} stackable>
        {
            loopcard.map(count=>{
              return(
                <Grid.Column  key="">
                <Segment raised>
                  <Placeholder>
                    <Placeholder.Header image>
                      <Placeholder.Line />
                      <Placeholder.Line />
                    </Placeholder.Header>
                    <Placeholder.Paragraph>
                      <Placeholder.Line length='medium' />
                      <Placeholder.Line length='short' />
                      <Placeholder.Line length='medium' />
                      <Placeholder.Line length='short' />
                    </Placeholder.Paragraph>
                  </Placeholder>
                </Segment>
              </Grid.Column>
              )
              
            })
        }
  </Grid>
  )
}
