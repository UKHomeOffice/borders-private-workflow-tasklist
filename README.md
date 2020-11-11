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
