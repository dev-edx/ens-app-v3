import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, Field, ScrollBox } from '@ensdomains/thorin'

import { AvatarWithIdentifier } from '@app/components/@molecules/AvatarWithIdentifier/AvatarWithIdentifier'

import { DetailedSwitch } from '../../../ProfileEditor/components/DetailedSwitch'
import type { SendNameForm } from '../../SendName-flow'
import { SummarySection } from './components/SummarySection'

const StyledScrollBox = styled(ScrollBox)(
  ({ theme }) =>
    css`
      width: 100%;
      margin-right: -${theme.space[2]};
    `,
)

const NameContainer = styled.div(
  ({ theme }) => css`
    padding: ${theme.space[2]};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.large};
  `,
)

const Content = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space[4]};
    padding-right: ${theme.space[2]};
  `,
)

type Props = {
  name: string
  onNext: () => void
  onBack: () => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SummaryView = ({ name, onNext, onBack }: Props) => {
  const { t } = useTranslation('transactionFlow')
  const { control, register } = useFormContext<SendNameForm>()
  const recipient = useWatch({ control, name: 'recipient' })
  return (
    <>
      <Dialog.Heading title={t('input.sendName.views.summary.title')} />
      <StyledScrollBox>
        <Content>
          <Field label={t('input.sendName.views.summary.fields.name.label')}>
            <NameContainer>
              <AvatarWithIdentifier
                size="8"
                name={name}
                address="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
                subtitle={t('input.sendName.views.summary.fields.name.expires', {
                  date: 'Nov 13, 2021',
                })}
              />
            </NameContainer>
          </Field>
          <Field label={t('input.sendName.views.summary.fields.recipient')}>
            <NameContainer>
              <AvatarWithIdentifier address={recipient} size="8" />
            </NameContainer>
          </Field>
          <Field label={t('input.sendName.views.summary.fields.options.label')}>
            <DetailedSwitch
              title={t('input.sendName.views.summary.fields.options.title')}
              description={t('input.sendName.views.summary.fields.options.description')}
              size="medium"
              {...register('transactions.resetProfile')}
            />
          </Field>
          <SummarySection />
        </Content>
      </StyledScrollBox>
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={onBack}>
            {t('action.back', { ns: 'common' })}
          </Button>
        }
        trailing={<Button onClick={onNext}>{t('action.send', { ns: 'common' })}</Button>}
      />
    </>
  )
}
