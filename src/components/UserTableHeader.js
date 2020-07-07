import React from 'react'

// Component specific scss
import './UserTableHeader.scss'

class UserTableHeader extends React.PureComponent {
    render() {
        return (
            <div id="user-table-header-wrapper">
                <div className="container-fluid py-3 d-flex">
                    <div className="ml-auto">
                        <button className="btn btn-light mx-1">
                            Export CSV</button>
                        <button className="btn btn-light mx-1"
                            onClick={() => this.props.create()}>
                            Create User</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserTableHeader