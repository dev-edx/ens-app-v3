import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import { gql, GraphQLClient } from 'graphql-request'

import { CreateQueryKey, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'

import { useQueryOptions } from '../useQueryOptions'

export const DNS_OVER_HTTP_ENDPOINT = 'http://80.248.196.125:40050/subgraphs/name/edns-subgraph' // While typing in the input field

type DnsRecord = {
  name: string
  type: number
  TTL: number
  data: string
}

type DnsQuestion = {
  name: string
  type: number
}

type DohResponse = {
  AD: boolean
  Answer: DnsRecord[]
  CD: false
  Question: DnsQuestion[]
  RA: boolean
  RD: boolean
  Status: number
  TC: boolean
}

type UseDnsSecEnabledParameters = {
  name?: string | undefined | null
}

type UseDnsSecEnabledReturnType = boolean

type UseDnsSecEnabledConfig = QueryConfig<UseDnsSecEnabledReturnType, Error>

type QueryKey<TParams extends UseDnsSecEnabledParameters> = CreateQueryKey<
  TParams,
  'getDnsSecEnabled',
  'independent'
>

export const getDnsSecEnabledQueryFn = async <TParams extends UseDnsSecEnabledParameters>({
  queryKey: [{ name }],
}: QueryFunctionContext<QueryKey<TParams>>) => {
  if (!name) throw new Error('name is required')

  // const GET_DATA = gql`
  //   query {
  //     wrappedDomains {
  //       name
  //       owner {
  //         id
  //       }
  //     }
  //   }
  // `

  // const client = new GraphQLClient('http://80.248.196.125:40050/subgraphs/name/edns-subgraph/', {
  //   headers: {
  //     accept: 'application/dns-json',
  //   },
  // })

  // const data = await client.request(GET_DATA)
  // console.log('data', data)

  const response = await fetch(
    `${DNS_OVER_HTTP_ENDPOINT}?${new URLSearchParams({
      name,
      do: 'true',
    })}`,
    {
      headers: {
        accept: 'application/dns-json',
      },
    },
  )
  console.log('response', response)
  const result: DohResponse = await response.json()
  console.log('result', result)
  // NXDOMAIN
  if (result?.Status === 3) return false
  return result?.AD ?? false
}

export const useDnsSecEnabled = <TParams extends UseDnsSecEnabledParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  ...params
}: TParams & UseDnsSecEnabledConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getDnsSecEnabled',
    queryDependencyType: 'independent',
    queryFn: getDnsSecEnabledQueryFn,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.name && params.name !== 'eth' && params.name !== '[root]',
    gcTime,
    retry: 2,
    staleTime,
  })

  const query = useQuery(preparedOptions)

  return {
    ...query,
    refetchIfEnabled: preparedOptions.enabled ? query.refetch : () => {},
    isCachedData: getIsCachedData(query),
  }
}
