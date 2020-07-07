// Just so I have a default template for user data

export default () => {
    return {
        admin: false,
        sso: false,
        disabled: false,
        name: "",
        email: "",
        apps: {
            prodView: { web: false, api: false, app: false },
            siteView: { web: false, api: false, app: false },
            wellView: { web: false, api: false, app: false },
            adminView: { web: false, api: false, app: false },
            rigView: { web: false, api: false, app: false },
            water: { web: false, api: false, app: false }
        }
    }
}