import React from 'react'

// Component specific scss
import './UserRow.scss'

class UserRow extends React.Component {
    render() {
        return (
            <tr className="user-row" onClick={() => this.props.editor(this.props.data, this.props.index, true)}>
                <td className="hide-small">{this.props.admin ? <i className="fas fa-key" /> : undefined}</td>
                <td className="hide-small">{this.props.disabled ? <i className="fas fa-check" /> : undefined}</td>
                <td className="hide-small">{this.props.sso ? <span className="badge badge-dark">SSO</span> : undefined}</td>
                <td className="hide-small">{this.props.guest ? <i className="fas fa-check" /> : undefined}</td>
                <td>{this.props.name}</td>

                {/* Place all peloton products by getting an array of the user objects apps passed in via props */}
                {Object.values(this.props.apps).map((item, index) =>
                    <td key={index}>
                        {item.web ? <i className="fas fa-desktop" /> : undefined}
                        {item.api ? <i className="fas fa-cloud" /> : undefined}
                        {item.app ? <i className="fas fa-mobile" /> : undefined}
                    </td>)}
                <td className="hide-small">{this.props.email}</td>
            </tr>
        )
    }
}

export default UserRow