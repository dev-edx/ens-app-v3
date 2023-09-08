import { ButtonHTMLAttributes, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Tag, mq } from '@ensdomains/thorin'

import { AvatarWithIdentifier } from '@app/components/@molecules/AvatarWithIdentifier/AvatarWithIdentifier'

const LeftContainer = styled.div(() => css``)

const RightContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    flex-flow: row wrap;
    gap: ${theme.space[2]};
  `,
)

const TagText = styled.span(
  () => css`
    ::first-letter {
      text-transform: capitalize;
    }
  `,
)

const Container = styled.button(({ theme }) => [
  css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.space[4]};
    gap: ${theme.space[6]};
    border-bottom: 1px solid ${theme.colors.border};
    transition: background-color 0.3s ease;

    :hover {
      background-color: ${theme.colors.accentSurface};
    }

    :disabled {
      background-color: ${theme.colors.greySurface};
      ${LeftContainer} {
        opacity: 0.5;
      }
    }
  `,
  mq.sm.min(css`
    padding: ${theme.space[4]} ${theme.space[6]};
  `),
])

type Props = {
  name?: string
  address: string
  role?: string
  roles: any[]
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export const SearchViewResult = ({ address, name, role, roles, ...props }: Props) => {
  const { t } = useTranslation('transactionFlow')
  const markers = useMemo(() => {
    console.log('markers', roles, address)
    console.log('address', address)
    const userRoles = roles.filter((r) => r.address?.toLowerCase() === address.toLowerCase())
    const hasRole = userRoles.some((r) => r.role === role)
    const primaryRole = userRoles[0]
    return { userRoles, hasRole, primaryRole }
  }, [roles, role, address])

  return (
    <Container type="button" disabled={markers.hasRole} {...props}>
      <LeftContainer>
        <AvatarWithIdentifier address={address} name={name} shorten={false} size="8" />
      </LeftContainer>
      {markers.primaryRole && (
        <RightContainer>
          <Tag>
            <TagText>{t(`roles.${markers.primaryRole?.role}.title`, { ns: 'common' })}</TagText>
          </Tag>
        </RightContainer>
      )}
    </Container>
  )
}
