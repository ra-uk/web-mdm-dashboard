import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactWinJS from 'react-winjs'
import Pluralize from 'pluralize'
import InvitationsLog from '../data/invitationsLog.json'
import WinJS from 'winjs'
import ItemList from '../ItemList'
import EmptyMessage from '../../Utils/EmptyMessage'
import ContentPane from '../../Utils/ContentPane'

export default class InvitationsPendingPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            layout: { type: WinJS.UI.ListLayout }
        }
    }

    ItemListRenderer = ReactWinJS.reactRenderer((ItemList) => {
        return (
            <div style={{ padding: '14px', width: '100%' }}>
                <b>{ItemList.data['PluginFlyvemdmInvitationLog.PluginFlyvemdmInvitationlog.event']}</b>
                <br />
                {ItemList.data['PluginFlyvemdmInvitationLog.PluginFlyvemdmInvitationlog.date_creation']}
            </div>
        )
    })

    render() {
        let currentLog = []

        for (let index = 0; index < InvitationsLog.data.length; index++) {
            const element = InvitationsLog.data[index]
            if (element['PluginFlyvemdmInvitationLog.PluginFlyvemdmInvitation.id'] === this.props.currentItem['PluginFlyvemdmInvitation.id']) {
                currentLog.push(element)
            }
        }

        if (currentLog.length > 0) {
            let currentListItemLogs = ItemList('InvitationsLog', currentLog)

            return (
                <ContentPane itemListPaneWidth={this.props.itemListPaneWidth} updateAnimation={true}>
                    <div className="listPane" style={{ padding: 0 }}>
                    <div className="contentHeader">
                        <h2 className="win-h2 titleContentPane" >Pending {Pluralize.singular(this.props.location[0])} </h2>
                    </div>
                    <ReactWinJS.ListView
                        ref="listView"
                        className="contentListView win-selectionstylefilled"
                        style={{ height: 'calc(100% - 48px)' }}
                        itemDataSource={currentListItemLogs.dataSource}
                        itemTemplate={this.ItemListRenderer}
                        layout={this.state.layout}
                        selectionMode={'single'}
                    />
                    </div>
                </ContentPane>
            )
        } else {

            return (
                <EmptyMessage message="No Logs Available" itemListPaneWidth={this.props.itemListPaneWidth} />
            )
        }
    }
}
InvitationsPendingPage.propTypes = {
    itemListPaneWidth: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    location: PropTypes.array.isRequired,
    currentItem: PropTypes.object.isRequired
}
