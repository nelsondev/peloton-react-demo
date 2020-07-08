import React from 'react'

// Component specific scss
import './UserEdit.scss'

// Data class
import DefaultUser from '../data/user'

// Toggle-able accordion box with disable-able checkbox fields.
class UserAppToggle extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            app: {
                web: props.data[props.product]["web"],
                api: props.data[props.product]["api"],
                app: props.data[props.product]["app"]
            }
        }
    }

    handleCheckbox(product, key) {
        let app = this.state.app

        app[key] = this.props.handle(product, key)

        this.setState({ app })
    }

    render() {
        return (
            <div className="card">
                <div className="card-header d-flex" id="prod-heading">
                    <h6 className="my-auto mr-2">{this.props.title}</h6>
                    <button type="button" className="btn btn-dark ml-auto btn-sm" data-toggle="collapse" data-target={`#${this.props.title}-collapse`}>
                        <i className="fas fa-angle-up"></i>
                    </button>
                </div>
                <div id={`${this.props.title}-collapse`} className="collapse">
                    <div className="card-body">
                        {/* Web app */}
                        {this.props.disableWeb ? undefined :
                            <>
                                <input type="checkbox" id={`${this.props.title}-web`} checked={this.state.app.web}
                                    onChange={() => this.handleCheckbox(this.props.product, "web")} />
                                <label htmlFor={`${this.props.title}-web`} className="ml-1">Web</label>
                                <br />
                            </>}
                        {/* Api */}
                        {this.props.disableApi ? undefined :
                            <>
                                <input type="checkbox" id={`${this.props.title}-api`} checked={this.state.app.api}
                                    onChange={() => this.handleCheckbox(this.props.product, "api")} />
                                <label htmlFor={`${this.props.title}-api`} className="ml-1">API</label>
                                <br />
                            </>
                        }
                        {/* Mobile app */}
                        {this.props.disableApp ? undefined :
                            <>
                                <input type="checkbox" id={`${this.props.title}-app`} checked={this.state.app.app}
                                    onChange={() => this.handleCheckbox(this.props.product, "app")} />
                                <label htmlFor={`${this.props.title}-app`} className="ml-1">App</label>
                            </>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

class UserCreate extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            // use default user if no user is specified.
            user: props.data ?? DefaultUser(),
            validated: false
        }
    }

    // Validate name field by just checking if it's empty and includes a space.
    validateName() {
        const nameElement = document.getElementById("name")
        const nameValidateElement = document.getElementById("name-validate")

        // Clean input
        nameElement.value = nameElement.value.replace(/<[^>]*>/g, "")

        const result = nameElement.value.trim() !== ""
            && nameElement.value.includes(" ")

        if (result) {
            nameElement.classList.remove("border-danger")
            nameElement.placeholder = "Tim Apple..."

            nameValidateElement.classList.add("d-none")
        }
        else {
            nameElement.classList.add("border-danger")
            nameElement.placeholder = "Please enter a valid name!"

            nameValidateElement.classList.remove("d-none")
        }

        return result
    }

    // Validate email field by checking for inclusion of @ and a . tld.
    validateEmail() {
        const emailElement = document.getElementById("email")
        const emailValidateElement = document.getElementById("email-validate")

        // Clean input
        emailElement.value = emailElement.value.replace(/<[^>]*>/g, "")

        const result = emailElement.value !== ""
            && emailElement.value.includes("@")
            && emailElement.value.includes(".")

        if (result) {
            emailElement.classList.remove("border-danger")
            emailElement.placeholder = "tim@apple.com"

            emailValidateElement.classList.add("d-none")
        }
        else {
            emailElement.classList.add("border-danger")
            emailElement.placeholder = "Please enter a valid email!"

            emailValidateElement.classList.remove("d-none")
        }

        return result
    }

    // Validate both input fields.
    validate() {
        const result = this.validateName() && this.validateEmail()

        this.setState({validated: result})

        return result
    }

    // handle string data entry via text input fields. Key being which field to adjust, value being what to adjust to.
    handleUserDataEnter(key, value) {
        this.validate()

        let user = this.state.user

        user[key] = value

        this.setState({ user })
    }

    // handle boolean data entry via check fields. Key being which field to toggle.
    handleUserDataToggle(key) {
        let user = this.state.user

        user[key] = !user[key]

        this.setState({ user })
    }
    // Handle app-specific data field toggling. App being which app to adjust, key being which field to toggle.
    handleAppDataToggle(app, key) {
        let user = this.state.user
        let apps = user.apps
        let result = !user.apps[app][key]

        apps[app][key] = result

        this.setState({ user })
        return result
    }
    // Validate inputs one more time before saving, call the passed in save handler via props. User being the user
    // data stored in this component state, index being which place in the array this user resides in parent data.
    handleSaveButton(user, index) {
        this.props.save(user, index)
    }

    componentDidMount() {
        this.validate()
    }

    render() {
        return (
            <div id="user-edit-wrapper">
                <div id="user-edit" className="d-flex">
                    <div className="card shadow m-auto user-edit-card">
                        <div className="card-body">
                            {/* Close button */}
                            <div className="row">
                                <div className="col d-flex">
                                    <button className="btn btn-light ml-auto" onClick={this.props.toggler.bind(this)}>
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            {/* Data form */}
                            <div className="row edit-form">
                                <div className="col">
                                    {/* Basic user info */}
                                    <div className="form-group">
                                        <label htmlFor="first">Full Name</label>
                                        <input type="text" id="name" className="form-control" placeholder="Tim Apple..." value={this.state.user.name}
                                            onChange={(e) => this.handleUserDataEnter("name", e.target.value)}
                                            onBlur={this.validateName.bind(this)} />
                                        <span id="name-validate" className="text-danger d-none">Please enter a valid full name.</span>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" name="email" id="email" className="form-control" placeholder="tim@apple.com..." value={this.state.user.email} disabled={this.props.new}
                                            onChange={(e) => this.handleUserDataEnter("email", e.target.value)}
                                            onBlur={this.validateEmail.bind(this)} />
                                        <span id="email-validate" className="text-danger d-none">Please enter a valid email.</span>
                                    </div>
                                    {/* Extra user info */}
                                    <div className="form-group">
                                        <input type="checkbox" name="disabled" id="disabled" checked={this.state.user.disabled}
                                            onChange={() => this.handleUserDataToggle("disabled")} />
                                        <label htmlFor="disabled" className="mx-2">Disabled</label>
                                        <input type="checkbox" name="admin" id="admin" checked={this.state.user.admin}
                                            onChange={() => this.handleUserDataToggle("admin")} />
                                        <label htmlFor="admin" className="mx-2">Admin</label>
                                        <input type="checkbox" name="sso" id="sso" checked={this.state.user.sso}
                                            onChange={() => this.handleUserDataToggle("sso")} />
                                        <label htmlFor="sso" className="mx-2">Single Sign On</label>
                                    </div>
                                    {/* App type toggles */}
                                    <div className="form-group accordion" id="prod-accordion">
                                        <div className="row mb-3">
                                            <div className="col">
                                                <UserAppToggle title="ProdView"
                                                    product="prodView"
                                                    data={this.state.user.apps}
                                                    handle={this.handleAppDataToggle.bind(this)} />
                                            </div>
                                            <div className="col">
                                                <UserAppToggle title="SiteView"
                                                    product="siteView"
                                                    data={this.state.user.apps}
                                                    disableApi
                                                    disableApp
                                                    handle={this.handleAppDataToggle.bind(this)} />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col">
                                                <UserAppToggle title="WellView"
                                                    product="wellView"
                                                    data={this.state.user.apps}
                                                    handle={this.handleAppDataToggle.bind(this)} />
                                            </div>
                                            <div className="col">
                                                <UserAppToggle title="AdminView"
                                                    product="adminView"
                                                    data={this.state.user.apps}
                                                    disableApi
                                                    disableApp
                                                    handle={this.handleAppDataToggle.bind(this)} />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <UserAppToggle title="RigView"
                                                    product="rigView"
                                                    data={this.state.user.apps}
                                                    disableApi
                                                    disableApp
                                                    handle={this.handleAppDataToggle.bind(this)} />
                                            </div>
                                            <div className="col">
                                                <UserAppToggle title="Water"
                                                    product="water"
                                                    data={this.state.user.apps}
                                                    disableApi
                                                    handle={this.handleAppDataToggle.bind(this)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Edit dialogue buttons for deleting, saving, canceling */}
                            <div className="row">
                                <div className="col">
                                    {this.props.new ? <button className="btn btn-danger"
                                        onClick={() => this.props.delete(this.props.index)}>Delete</button> : undefined}
                                </div>
                                <div className="col text-right">
                                    <button className="btn btn-light mr-2"
                                        onClick={(e) => this.handleSaveButton(this.state.user, this.props.index, e)}
                                        disabled={!this.state.validated}>Save</button>
                                    <button className="btn btn-light"
                                        onClick={this.props.toggler.bind(this)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserCreate