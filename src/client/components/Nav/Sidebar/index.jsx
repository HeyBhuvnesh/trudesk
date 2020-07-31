/*
 *       .                             .o8                     oooo
 *    .o8                             "888                     `888
 *  .o888oo oooo d8b oooo  oooo   .oooo888   .ooooo.   .oooo.o  888  oooo
 *    888   `888""8P `888  `888  d88' `888  d88' `88b d88(  "8  888 .8P'
 *    888    888      888   888  888   888  888ooo888 `"Y88b.   888888.
 *    888 .  888      888   888  888   888  888    .o o.  )88b  888 `88b.
 *    "888" d888b     `V88V"V8P' `Y8bod88P" `Y8bod8P' 8""888P' o888o o888o
 *  ========================================================================
 *  Author:     Chris Brame
 *  Updated:    1/20/19 4:46 PM
 *  Copyright (c) 2014-2019. All rights reserved.
 */

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import SidebarItem from 'components/Nav/SidebarItem'
import NavSeparator from 'components/Nav/NavSeperator'
import Submenu from 'components/Nav/Submenu'
import SubmenuItem from 'components/Nav/SubmenuItem'
import {languageIn} from  '../../../../data/in'
import { updateNavChange } from '../../../actions/nav'

import Helpers from 'lib/helpers'

class Sidebar extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    Helpers.UI.getPlugins((err, result) => {
      if (!err && result.plugins) {
        this.setState({ plugins: result.plugins })
      }
    })
  }

  componentDidUpdate () {
    Helpers.UI.initSidebar()
    Helpers.UI.bindExpand()
  }

  renderPlugins () {
    const { plugins, sessionUser, activeItem, activeSubItem } = this.state
    return (
      <SidebarItem
        text='Plugins'
        icon='extension'
        href='/plugins'
        class='navPlugins tether-plugins'
        hasSubmenu={plugins && plugins.length > 0}
        subMenuTarget='plugins'
        active={activeItem === 'plugins'}
      >
        {plugins && plugins.length > 0 && (
          <Submenu id='plugins' subMenuOpen={activeItem === 'plugins'}>
            {plugins.map(function (item) {
              const perms = item.permissions.split(' ')
              if (perms.indexOf(sessionUser.role) === -1) return
              return (
                <SubmenuItem
                  key={item.name}
                  text={item.menu.main.name}
                  icon={item.menu.main.icon}
                  href={item.menu.main.link}
                  active={activeSubItem === item.name}
                />
              )
            })}
          </Submenu>
        )}
      </SidebarItem>
    )
  }

  render () {
    const { activeItem, activeSubItem, sessionUser } = this.props
    return (
      <ul className='side-nav'>
        {sessionUser && Helpers.canUser('agent:*', true) && (
          <SidebarItem
            text={languageIn.DASHBOARD}
            icon='dashboard'
            href='/dashboard'
            class='navHome'
            active={activeItem === 'dashboard'}
          />
        )}
        {sessionUser && Helpers.canUser('tickets:view') && (
          <SidebarItem
            text={languageIn.TICKETS}
            icon='assignment'
            href='/tickets'
            class='navTickets no-ajaxy'
            hasSubmenu={true}
            subMenuTarget='tickets'
            active={activeItem === 'tickets'}
          >
            <Submenu id='tickets'>
              <SubmenuItem
                text={languageIn.ACTIVE}
                icon='timer'
                href='/tickets/active'
                active={activeSubItem === 'tickets-active'}
              />
              <SubmenuItem
                text={languageIn.ASSIGNED}
                icon='assignment_ind'
                href='/tickets/assigned'
                active={activeSubItem === 'tickets-assigned'}
              />
              <SubmenuItem
                text={languageIn.UN_ASSIGN}
                icon='person_add_disabled'
                href='/tickets/unassigned'
                active={activeSubItem === 'tickets-unassigned'}
              />
              <NavSeparator />
              <SubmenuItem text={languageIn.NEW} icon='&#xE24D;' href='/tickets/new' active={activeSubItem === 'tickets-new'} />
              <SubmenuItem
                text={languageIn.PENDING}
                icon='&#xE629;'
                href='/tickets/pending'
                active={activeSubItem === 'tickets-pending'}
              />
              <SubmenuItem   text={languageIn.OPEN} icon='&#xE2C8;' href='/tickets/open' active={activeSubItem === 'tickets-open'} />
              <SubmenuItem
                text={languageIn.CLOSED}
                icon='&#xE2C7;'
                href='/tickets/closed'
                active={activeSubItem === 'tickets-closed'}
              />
            </Submenu>
          </SidebarItem>
        )}
        <SidebarItem
          text={languageIn.MESSAGES}
          icon='chat'
          href='/messages'
          class='navMessages'
          active={activeItem === 'messages'}
        />
        {sessionUser && Helpers.canUser('accounts:view') && (
          <SidebarItem
            text={languageIn.ACCOUNT}
            icon='&#xE7FD;'
            href='/accounts'
            class='navAccounts'
            active={activeItem === 'accounts'}
            subMenuTarget='accounts'
            hasSubmenu={sessionUser && Helpers.canUser('agent:*', true)}
          >
            {sessionUser && Helpers.canUser('agent:*', true) && (
              <Submenu id='accounts'>
                <SubmenuItem
                  href={'/accounts/customers'}
                  text={languageIn.CUSTOMER}
                  icon={'account_box'}
                  active={activeSubItem === 'accounts-customers'}
                />
                {sessionUser && Helpers.canUser('agent:*', true) && (
                  <SubmenuItem
                    href={'/accounts/agents'}
                    text={languageIn.AGENTS}
                    icon={'account_circle'}
                    active={activeSubItem === 'accounts-agents'}
                  />
                )}
                {sessionUser && Helpers.canUser('admin:*') && (
                  <SubmenuItem
                    href={'/accounts/admins'}
                    text={languageIn.ADMINS}
                    icon={'how_to_reg'}
                    active={activeSubItem === 'accounts-admins'}
                  />
                )}
              </Submenu>
            )}
          </SidebarItem>
        )}
        {sessionUser && Helpers.canUser('groups:view') && (
          <SidebarItem
            text={languageIn.CUSTOMER_GROUPS}
            icon='supervisor_account'
            href='/groups'
            class='navGroups'
            active={activeItem === 'groups'}
          />
        )}
        {sessionUser && Helpers.canUser('teams:view') && (
          <SidebarItem   text={languageIn.TEAMS} icon='wc' href='/teams' class='navTeams' active={activeItem === 'teams'} />
        )}
        {sessionUser && Helpers.canUser('departments:view') && (
          <SidebarItem
            text={languageIn.DEPARTMENTS}
            icon='domain'
            href='/departments'
            class='navTeams'
            active={activeItem === 'departments'}
          />
        )}
        {sessionUser && Helpers.canUser('reports:view') && (
          <SidebarItem
            text={languageIn.REPORTS}
            icon='assessment'
            href='/reports/generate'
            class='navReports no-ajaxy'
            hasSubmenu={true}
            subMenuTarget='reports'
            active={activeItem === 'reports'}
          >
            <Submenu id='reports'>
              <SubmenuItem
                text={languageIn.GENERATE}
                icon='timeline'
                href='/reports/generate'
                active={activeSubItem === 'reports-generate'}
              />
              <NavSeparator />
              <SubmenuItem
                text={languageIn.GROUP + languageIn.BREAKDOWN}
                icon='supervisor_account'
                href='/reports/breakdown/group'
                active={activeSubItem === 'reports-breakdown-group'}
              />
              <SubmenuItem
                text={languageIn.USERS +languageIn.BREAKDOWN}
                icon='perm_identity'
                href='/reports/breakdown/user'
                active={activeSubItem === 'reports-breakdown-user'}
              />
            </Submenu>
          </SidebarItem>
        )}

        {/*{this.renderPlugins()}*/}

        {sessionUser && Helpers.canUser('notices:view') && (
          <SidebarItem
            text={languageIn.NOTICES}
            icon='warning'
            href='/notices'
            class='navNotices'
            active={activeItem === 'notices'}
          />
        )}

        {sessionUser && Helpers.canUser('settings:edit') && (
          <SidebarItem
            text={languageIn.SETTINGS}
            icon='settings'
            href='/settings/general'
            class='navSettings no-ajaxy'
            hasSubmenu={true}
            subMenuTarget='settings'
            active={activeItem === 'settings'}
          >
            <Submenu id='settings'>
              <SubmenuItem text={languageIn.GENERAL} icon='tune' href='/settings' active={activeSubItem === 'settings-general'} />
              <SubmenuItem
                text={languageIn.APPEARANCE}
                icon='style'
                href='/settings/appearance'
                active={activeSubItem === 'settings-appearance'}
              />
              <SubmenuItem
                text={languageIn.TICKETS}
                icon='assignment'
                href='/settings/tickets'
                active={activeSubItem === 'settings-tickets'}
              />
              <SubmenuItem
                text={languageIn.PERMISSIONS}
                icon='security'
                href='/settings/permissions'
                active={activeSubItem === 'settings-permissions'}
              />
              <SubmenuItem
                text={languageIn.MAILER}
                icon='email'
                href='/settings/mailer'
                active={activeSubItem === 'settings-mailer'}
              />
              {/*<SubmenuItem text="Notifications" icon="" href="/settings/notifications" active={activeSubItem === 'settings-notifications'} />*/}
              <SubmenuItem
                href={'/settings/elasticsearch'}
                text={'Elasticsearch'}
                icon={'search'}
                active={activeSubItem === 'settings-elasticsearch'}
              />
              <SubmenuItem
                text={languageIn.PUSH_SERVICE}
                icon='mobile_friendly'
                href='/settings/tps'
                active={activeSubItem === 'settings-tps'}
              />
              <SubmenuItem
                text={languageIn.BACKUP_RESTORE}
                icon='archive'
                href='/settings/backup'
                active={activeSubItem === 'settings-backup'}
              />
              <SubmenuItem
                text={languageIn.LEGAL}
                icon='gavel'
                href='/settings/legal'
                active={activeSubItem === 'settings-legal'}
              />
              {sessionUser && Helpers.canUser('settings:logs') && (
                <SubmenuItem
                  text={languageIn.LOGS}
                  icon='remove_from_queue'
                  href='/settings/logs'
                  hasSeperator={true}
                  active={activeSubItem === 'settings-logs'}
                />
              )}
            </Submenu>
          </SidebarItem>
        )}
        <NavSeparator />
        <SidebarItem href='/about' icon='help'   text={languageIn.ABOUT} active={activeItem === 'about'} />
        <SidebarItem href={'https://www.trudesk.io'} icon={'cloud'}   text={languageIn.CLOUD} target={'_blank'} />
      </ul>
    )
  }
}

Sidebar.propTypes = {
  updateNavChange: PropTypes.func.isRequired,
  activeItem: PropTypes.string.isRequired,
  activeSubItem: PropTypes.string.isRequired,
  sessionUser: PropTypes.object,
  plugins: PropTypes.array
}

const mapStateToProps = state => ({
  activeItem: state.sidebar.activeItem,
  activeSubItem: state.sidebar.activeSubItem,
  sessionUser: state.shared.sessionUser
})

export default connect(
  mapStateToProps,
  { updateNavChange }
)(Sidebar)
