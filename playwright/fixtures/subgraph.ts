/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */

/* eslint-disable no-promise-executor-return */
import { gql, GraphQLClient } from 'graphql-request'

import { Provider } from './provider.js'

export type Subgraph = ReturnType<typeof createSubgraph>

const query = gql`
  query getMeta {
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`

export const waitForSubgraph = (provider: Provider) => async () => {
  const blockNumber = await provider.getBlockNumber()
  let wait = true
  let count = 0
  do {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const client = new GraphQLClient('http://80.248.196.125:40050/subgraphs/name/edns-subgraph')
    const res = await client.request(query)
    console.log('res', res)
    wait = blockNumber > res._meta.block.number
    count += 1
    console.log(`subgraph: ${res._meta.block.number} -> ${blockNumber} ${!wait ? '[IN SYNC]' : ''}`)
  } while (wait && count < 10)
}

type Dependencies = {
  provider: Provider
}

export const createSubgraph = ({ provider }: Dependencies) => ({
  sync: waitForSubgraph(provider),
})
