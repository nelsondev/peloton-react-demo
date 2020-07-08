import React from 'react'

// Component specific scss
import './UserTable.scss'

// Components
import UserRow from './UserRow'
import UserTableHeader from './UserTableHeader'
import UserEdit from './UserEdit'

// Temporary json data and default user object
import data from '../data/user-list.json'
import DefaultUser from '../data/user'

class UserTable extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            users: [],

            // Holds state for recently sorted value and if it is ascending or descending
            sorted: {},

            // Not the best way to do this, I should've had a "editing" object with all relavent
            // data. editing: { enabled: true, deletable: false, user: {}, index: 0 }
            editing: false,
            editingUser: {},
            editingIndex: -1,
            deletable: false
        }
    }

    getData() {
        return this.parseData(data);
    }

    // Parse user data list from raw json
    parseData(data) {
        const users = []

        for (var user of data.users) {
            users.push(this.parseUser(user))
        }

        return users;
    }

    // Parse user data from raw user json
    parseUser(data) {
        // Helper function for parsing app types (thick, api, or mobile)
        var parseUserAppType = function (existing, str) {
            if (!existing) existing = {}

            // Further parsing of data to check specific type of access to
            // peloton apps.
            if (str.includes("USERS")) existing.web = true
            if (str.includes("APIACCESS")) existing.api = true
            if (str.includes("MOBILE")) existing.app = true

            return existing;
        }

        // Helper function for parsing user app data from a list of group strings
        let parseUserApps = (data) => {
            let apps = DefaultUser().apps

            // Go through user group dns data and extract which peloton apps are enabled
            // from said data.
            for (var group of data) {
                if (group.includes("PRODVIEW"))
                    apps.prodView = parseUserAppType(apps.prodView, group)
                if (group.includes("SITEVIEW"))
                    apps.siteView = parseUserAppType(apps.siteView, group)
                if (group.includes("WELLVIEW"))
                    apps.wellView = parseUserAppType(apps.wellView, group)
                if (group.includes("ADMINVIEW"))
                    apps.adminView = parseUserAppType(apps.adminView, group)
                if (group.includes("RIGVIEW"))
                    apps.rigView = parseUserAppType(apps.rigView, group)
                if (group.includes("WATER"))
                    apps.water = parseUserAppType(apps.water, group)
            }

            return apps;
        }

        // Return new user object
        return {
            admin: data.isadmin,
            disabled: !data.enabled,
            sso: data.isExternallyHosted,
            guest: data.isguest,
            name: `${data.givenname} ${data.surname}`,
            email: data.emailaddress,
            apps: parseUserApps(data.groupdns)
        }
    }

    // Sort column (ascending or descending) by user object key (name, email)
    sort(key) {
        let data = [...this.state.users]
        let sort = this.state.sorted[key]
        let sorted = {}

        // Sort by ascending or descending based on if the state sorted key is truthy or falsy.
        if (sort) {
            data = data.sort((a, b) => (a[key].toLowerCase() < b[key].toLowerCase()) ? 1 : -1)
        }
        else {
            data = data.sort((a, b) => (a[key].toLowerCase() > b[key].toLowerCase()) ? 1 : -1)
        }

        // Flip sort boolean so next click will be ascending if was descending.
        sorted[key] = !sort

        this.setState({ users: data })
        this.setState({ sorted })
    }

    // Place sorted arrow when sortable field is clicked
    sortIcon(key) {
        // Remove icon if key doesn't match recently sorted value
        if (this.state.sorted[key] === undefined) return

        if (this.state.sorted[key]) return <i className="fas fa-sort-up"></i>

        return <i className="fas fa-sort-down"></i>
    }

    // Save editor data, overwrite and/or create user data into user array
    saveEditor(user, index = -1) {
        let users = this.state.users

        // Create new user if index is default value -1
        if (index === -1)
            users.push(user)
        // Update if index is specified
        else
            users[index] = user

        this.setState({ users })

        this.closeEditor()
    }

    // Remove editor data, remove specific user data from user array
    deleteEditor(index) {
        let users = this.state.users

        users.splice(index, 1)

        this.setState({ users })

        this.closeEditor()
    }

    // Open editor by setting all editing booleans to true, and defining a user to edit
    openEditor(user, index, deletable = false) {
        this.setState({ editing: true, editingUser: user, editingIndex: index, deletable })
    }

    // Close editor by clearing all editor state data
    closeEditor() {
        this.setState({ editing: false, editingUser: undefined, deletable: false })
    }

    // Load and parse all data on mount
    componentDidMount() {
        this.setState({ users: this.getData() })
    }

    render() {
        return (
            <div id="user-table-wrapper" className="user-table">
                {/* Add button */}
                <UserTableHeader
                    create={this.openEditor.bind(this)} />
                {this.state.editing ? <UserEdit
                    data={this.state.editingUser}
                    toggler={this.closeEditor.bind(this)}
                    save={this.saveEditor.bind(this)}
                    delete={this.deleteEditor.bind(this)}
                    new={this.state.deletable}
                    index={this.state.editingIndex} /> : undefined}
                {/* Table */}
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th className="hide-small">Admin</th>
                                <th className="hide-small">Disabled</th>
                                <th className="hide-small">SSO</th>
                                <th className="hide-small">Guest</th>
                                <th onClick={() => this.sort("name")}>
                                    <span type="button">Name</span> {this.sortIcon("name")}</th>
                                <th>Prod View</th>
                                <th>Site View</th>
                                <th>Well View</th>
                                <th>Admin View</th>
                                <th>Rig View</th>
                                <th>Water</th>
                                <th onClick={() => this.sort("email")} className="hide-small">
                                    <span type="button">Email</span> {this.sortIcon("email")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Place all user row objects when data is parsed */}
                            {this.state.users.map((item, index) =>
                                <UserRow
                                    key={index}
                                    admin={item.admin}
                                    disabled={item.disabled}
                                    sso={item.sso}
                                    guest={item.guest}
                                    name={item.name}
                                    email={item.email}
                                    apps={item.apps}
                                    data={item}
                                    index={index}
                                    editor={this.openEditor.bind(this)}
                                />)}
                        </tbody>
                    </table>
                </div>

            </div>
        )
    }
}

export default UserTable