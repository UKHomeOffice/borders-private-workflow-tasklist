export default {
    "id": "ecab1526-591c-4881-bf5b-84e26ef88876",
    "name": "simple",
    "path": "simple",
    "title": "simple",
    "display": "form",
    "components": [
        {
            "id": "eeb49mr",
            "key": "textField",
            "case": "",
            "mask": false,
            "tags": "",
            "type": "textfield",
            "input": true,
            "label": "Text Field",
            "logic": [],
            "hidden": false,
            "prefix": "",
            "suffix": "",
            "unique": false,
            "widget": {
                "type": "input"
            },
            "dbIndex": false,
            "overlay": {
                "top": "",
                "left": "",
                "page": "",
                "style": "",
                "width": "",
                "height": ""
            },
            "tooltip": "",
            "disabled": false,
            "multiple": false,
            "redrawOn": "",
            "tabindex": "",
            "validate": {
                "json": "",
                "custom": "",
                "pattern": "",
                "required": false,
                "maxLength": "",
                "minLength": "",
                "customMessage": "",
                "customPrivate": false,
                "strictDateValidation": false
            },
            "autofocus": false,
            "encrypted": false,
            "hideLabel": false,
            "inputMask": "",
            "inputType": "text",
            "protected": false,
            "refreshOn": "",
            "tableView": true,
            "attributes": {},
            "errorLabel": "",
            "persistent": true,
            "properties": {},
            "spellcheck": true,
            "validateOn": "change",
            "clearOnHide": true,
            "conditional": {
                "eq": "",
                "json": "",
                "show": null,
                "when": null
            },
            "customClass": "",
            "description": "",
            "inputFormat": "plain",
            "placeholder": "",
            "defaultValue": null,
            "alwaysEnabled": false,
            "labelPosition": "top",
            "showCharCount": false,
            "showWordCount": false,
            "calculateValue": "",
            "customConditional": "",
            "allowMultipleMasks": false,
            "customDefaultValue": "",
            "allowCalculateOverride": false
        },
        {
            "id": "e8oxgqr",
            "key": "submit",
            "size": "md",
            "type": "button",
            "block": false,
            "input": true,
            "label": "Submit",
            "theme": "primary",
            "action": "submit",
            "hidden": false,
            "prefix": "",
            "suffix": "",
            "unique": false,
            "widget": {
                "type": "input"
            },
            "dbIndex": false,
            "overlay": {
                "top": "",
                "left": "",
                "style": "",
                "width": "",
                "height": ""
            },
            "tooltip": "",
            "disabled": false,
            "leftIcon": "",
            "multiple": false,
            "redrawOn": "",
            "tabindex": "",
            "validate": {
                "custom": "",
                "required": false,
                "customPrivate": false,
                "strictDateValidation": false
            },
            "autofocus": false,
            "encrypted": false,
            "hideLabel": false,
            "protected": false,
            "refreshOn": "",
            "rightIcon": "",
            "tableView": false,
            "attributes": {},
            "errorLabel": "",
            "persistent": false,
            "properties": {},
            "validateOn": "change",
            "clearOnHide": true,
            "conditional": {
                "eq": "",
                "show": null,
                "when": null
            },
            "customClass": "",
            "description": "",
            "placeholder": "",
            "defaultValue": null,
            "alwaysEnabled": false,
            "dataGridLabel": true,
            "labelPosition": "top",
            "showCharCount": false,
            "showWordCount": false,
            "calculateValue": "",
            "disableOnInvalid": true,
            "allowMultipleMasks": false,
            "customDefaultValue": "",
            "allowCalculateOverride": false,
            "path": "submit"
        }
    ],
    "access": [
        {
            "id": "3f0160ca-9522-4ff4-9d6c-8d5842578936",
            "name": "anonymous",
            "description": "Default role that allows anyone to see a form",
            "active": true
        }
    ],
    "versionId": "4367ab0e-4892-471f-b13e-9c537e90089f",
    "createdOn": "2020-02-25T12:49:28.386Z",
    "updatedOn": "2020-02-25T12:49:28.386Z",
    "latest": true,
    "links": [
        {
            "rel": "self",
            "title": "Self",
            "method": "GET",
            "href": "http://localhost:4000/forms/ecab1526-591c-4881-bf5b-84e26ef88876"
        },
        {
            "rel": "allVersions",
            "title": "Show all versions",
            "method": "GET",
            "href": "http://localhost:4000/forms/ecab1526-591c-4881-bf5b-84e26ef88876/versions"
        },
        {
            "rel": "comments",
            "title": "Show all comments",
            "method": "GET",
            "href": "http://localhost:4000/forms/ecab1526-591c-4881-bf5b-84e26ef88876/comments"
        },
        {
            "rel": "create-comment",
            "title": "Add a comment",
            "method": "POST",
            "href": "http://localhost:4000/forms/ecab1526-591c-4881-bf5b-84e26ef88876/comments"
        },
        {
            "rel": "update",
            "title": "Update form",
            "method": "PUT",
            "href": "http://localhost:4000/forms/ecab1526-591c-4881-bf5b-84e26ef88876"
        },
        {
            "rel": "delete",
            "title": "Delete form",
            "method": "DELETE",
            "href": "http://localhost:4000/forms/ecab1526-591c-4881-bf5b-84e26ef88876"
        }
    ]

}
