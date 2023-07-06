import { useMemo } from 'react'

import { OwnerArray, ReturnedENS } from '@app/types'

import { useSelfAbilities } from './useSelfAbilities'

type Props = {
  ownerData: ReturnedENS['getOwner']
  wrapperData: ReturnedENS['getWrapperData']
  dnsOwner?: ReturnedENS['getDNSOwner']
  selfAbilities?: ReturnType<typeof useSelfAbilities>
}

const useOwners = ({ ownerData, wrapperData, dnsOwner, selfAbilities }: Props) => {
  const owners = useMemo(() => {
    const _owners: OwnerArray = []
    if (ownerData?.ownershipLevel === 'nameWrapper') {
      _owners.push({
        address: ownerData.owner!,
        canTransfer: selfAbilities?.canSend ?? false,
        transferType: 'owner',
        label: wrapperData?.parent.PARENT_CANNOT_CONTROL ? 'name.owner' : 'name.manager',
        description: 'details.descriptions.owner',
        testId: 'owner-button-owner',
      })
    } else {
      if (ownerData?.owner) {
        _owners.push({
          address: ownerData?.owner,
          canTransfer: selfAbilities?.canSend ?? false,
          transferType: 'manager',
          label: 'name.manager',
          description: 'details.descriptions.controller',
          testId: 'owner-button-owner',
        })
      }
      if (ownerData?.registrant) {
        _owners.push({
          address: ownerData.registrant,
          canTransfer: selfAbilities?.canSendOwner ?? false,
          transferType: 'owner',
          label: 'name.owner',
          description: 'details.descriptions.registrant',
          testId: 'owner-button-registrant',
        })
      }
    }
    if (dnsOwner) {
      _owners.push({
        address: dnsOwner,
        canTransfer: false,
        label: 'name.dnsOwner',
        description: 'details.descriptions.dnsOwner',
        testId: 'owner-button-dnsOwner',
      })
    }

    return _owners
  }, [ownerData, wrapperData, selfAbilities, dnsOwner])

  return owners
}

export default useOwners
