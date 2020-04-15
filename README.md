# COP Private UI

This UI provides a central point for forms,tasks and cases. Forms and tasks are surfaced to users by business processes. Actions that you perform on tasks are controlled
by business processes. The UI is agnostic of any particular business specific code rather it relies on the business process service
to tell it what forms and tasks are available to a given user.

**Please note: Do not place fixes that related to a particular business process in the UI. You should seek to fix those in the appropriate BPMN. This is a shared UI across multiple business processes and users**

## Set up

Ensure the following:

* Keycloak instance up and running
* Define the tasklist as a client within your realm in Keycloak instance
* Export the environment variables defined in the [sample.env](sample.env) file.
    

## Running in development

1 - Install dependencies
```
npm install
```

2 - Define and export variables in the `sample.env` file
```
source sample.env
```

3 - Run app locally (runs the app with hot reload)
```
npm run dev
```

4 - Open your browser and navigate to `http://localhost:8080`

## Running in production

1 - Install dependencies
```
npm install
```

2 - Build webpack
```
npm run build
```

3 - Go into the `dist` folder
```
cd dist/
```

4 - Run server
```
node server.js
```

5 - Open your browser and navigate to `http://localhost:8080`
```
http://localhost:8080
```

# Drone secrets

Name|Example value
---|---
dev_drone_aws_access_key_id|https://console.aws.amazon.com/iam/home?region=eu-west-2#/users/bf-it-devtest-drone?section=security_credentials
dev_drone_aws_secret_access_key|https://console.aws.amazon.com/iam/home?region=eu-west-2#/users/bf-it-devtest-drone?section=security_credentials
drone_public_token|Drone token (Global for all github repositories and environments)
env_analytics_site_id|x
env_analytics_url|https://matomo.dev.cop.homeoffice.gov.uk, https://matomo.staging.cop.homeoffice.gov.uk, https://matomo.cop.homeoffice.gov.uk
env_api_cop_url|operational-data-api.dev.cop.homeoffice.gov.uk, operational-data-api.staging.cop.homeoffice.gov.uk, operational-data-api.cop.homeoffice.gov.uk
env_api_ref_url|api.dev.refdata.homeoffice.gov.uk, api.staging.refdata.homeoffice.gov.uk, api.refdata.homeoffice.gov.uk
env_engine_url|private-workflow-engine.dev.cop.homeoffice.gov.uk, private-workflow-engine.staging.cop.homeoffice.gov.uk, private-workflow-engine.cop.homeoffice.gov.uk
env_keycloak_realm|cop-dev, cop-staging, cop-prod
env_keycloak_url|sso-dev.notprod.homeoffice.gov.uk/auth, sso.digital.homeoffice.gov.uk/auth
env_kube_namespace_private_cop|private-cop-dev, private-cop-staging, private-cop
env_kube_server|https://kube-api-notprod.notprod.acp.homeoffice.gov.uk, https://kube-api-prod.prod.acp.homeoffice.gov.uk
env_kube_token|xxx
env_report_url|reporting.dev.cop.homeoffice.gov.uk, reporting.staging.cop.homeoffice.gov.uk, reporting.cop.homeoffice.gov.uk
env_translation_url|translation.dev.cop.homeoffice.gov.uk, translation.staging.cop.homeoffice.gov.uk, translation.cop.homeoffice.gov.uk
env_whitelist|comma separated x.x.x.x/x list
env_www_storage_key|xxx
env_www_ui_environment|DEVELOPMENT, STAGING, PRODUCTION
env_www_url|www.dev.cop.homeoffice.gov.uk, www.staging.cop.homeoffice.gov.uk, www.cop.homeoffice.gov.uk
nginx_image|quay.io/ukhomeofficedigital/nginx-proxy
nginx_tag|latest
production_drone_aws_access_key_id|https://console.aws.amazon.com/iam/home?region=eu-west-2#/users/bf-it-prod-drone?section=security_credentials
production_drone_aws_secret_access_key|https://console.aws.amazon.com/iam/home?region=eu-west-2#/users/bf-it-prod-drone?section=security_credentials
protocol_https|https
quay_password|xxx (Global for all repositories and environments)
quay_username|docker (Global for all repositories and environments)
slack_webhook|https://hooks.slack.com/services/xxx/yyy/zzz (Global for all repositories and environments)
staging_drone_aws_access_key_id|https://console.aws.amazon.com/iam/home?region=eu-west-2#/users/bf-it-prod-drone?section=security_credentials
staging_drone_aws_secret_access_key|https://console.aws.amazon.com/iam/home?region=eu-west-2#/users/bf-it-prod-drone?section=security_credentials
www_image|quay.io/ukhomeofficedigital/cop-private-workflow-tasklist
www_keycloak_access_role|xxx
www_keycloak_client_id|keycloak client name
www_name|www
www_port|8080
www_ui_version|BETA

