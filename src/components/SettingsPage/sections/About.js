// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import type { T } from 'types/common'
import TrackPage from 'analytics/TrackPage'
import IconHelp from 'icons/Help'
import resolveLogsDirectory from 'helpers/resolveLogsDirectory'
import { urls } from 'config/support'

import ExportLogsBtn from 'components/ExportLogsBtn'
import CleanButton from '../CleanButton'
import ResetButton from '../ResetButton'
import ReleaseNotesButton from '../ReleaseNotesButton'
import AboutRowItem from '../AboutRowItem'

import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from '../SettingsSection'

type Props = {
  t: T,
}

class SectionAbout extends PureComponent<Props> {
  render() {
    const { t } = this.props
    const version = __APP_VERSION__

    return (
      <Section>
        <TrackPage category="Settings" name="About" />

        <Header
          icon={<IconHelp size={16} />}
          title={t('app:settings.tabs.about')}
          desc={t('app:settings.about.desc')}
        />

        <Body>
          <Row title={t('app:settings.about.version')} desc={`Ledger Live ${version}`}>
            <ReleaseNotesButton />
          </Row>

          <Row
            title={t('app:settings.profile.softResetTitle')}
            desc={t('app:settings.profile.softResetDesc')}
          >
            <CleanButton />
          </Row>
          <Row
            title={t('app:settings.profile.hardResetTitle')}
            desc={t('app:settings.profile.hardResetDesc')}
          >
            <ResetButton />
          </Row>
          <Row
            title={t('app:settings.exportLogs.title')}
            desc={t('app:settings.exportLogs.desc', { logsDirectory: resolveLogsDirectory() })}
          >
            <ExportLogsBtn />
          </Row>

          <AboutRowItem
            title={t('app:settings.about.faq')}
            desc={t('app:settings.about.faqDesc')}
            url={urls.faq}
          />

          <AboutRowItem
            title={t('app:settings.about.terms')}
            desc={t('app:settings.about.termsDesc')}
            url={urls.terms}
          />
        </Body>
      </Section>
    )
  }
}

export default translate()(SectionAbout)
