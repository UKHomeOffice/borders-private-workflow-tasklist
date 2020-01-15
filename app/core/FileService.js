import axios from 'axios';
import jwt_decode from "jwt-decode";
import qs from "querystring";

class FileService {

    constructor(keycloak) {
        this.keycloak = keycloak;
    }

    async uploadFile(storage, file, fileName, dir, evt, url, options) {
        const fd = new FormData();
        const data = {
            file: file,
            name: fileName,
            dir: dir
        };
        const json = (typeof data === 'string');

        if (!json) {
            for (const key in data) {
                fd.append(key, data[key]);
            }
        }

        const token = await this.getToken();
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
            onUploadProgress: function (progressEvent) {
                evt({
                    total: progressEvent.total,
                    loaded: progressEvent.loaded
                });
            }
        };
        const response = await axios.post(url, data, config);
        return {
            storage: 'url',
            fileName,
            url: response.data.url,
            size: file.size,
            type: file.type,
            data: response.data
        };
    }

    async getToken() {
        let token = this.keycloak.token;
        const isExpired = jwt_decode(token).exp < new Date().getTime() / 1000;
        if (isExpired) {
            try {
                const response = await axios({
                    method: 'POST',
                    url: `${this.keycloak.authServerUrl}/realms/${this.keycloak.realm}/protocol/openid-connect/token`,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: qs.stringify({
                        grant_type: 'refresh_token',
                        client_id: this.keycloak.clientId,
                        refresh_token: this.keycloak.refreshToken
                    })
                });
                token = response.data.access_token;
            } catch (e) {
                console.error(e);
            }
        }
        return token;
    }

    async deleteFile(fileInfo) {
        return new Promise(async (resolve, reject) => {
            const token = await this.getToken();
            axios.delete(fileInfo.url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    resolve('File deleted');
                } else {
                    reject('Failed to delete file');
                }
            }).catch((e) => {
                reject(e || 'Failed to delete file');
            });
        })
    }

    async downloadFile(fileInfo, options) {
        return new Promise(async (resolve, reject) => {
            const token = await this.getToken();
            axios({
                url: fileInfo.url,
                method: 'GET',
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((response) => {
                const file = new Blob([response.data]);
                const fileURL = URL.createObjectURL(file);
                const link = document.createElement('a');
                link.href = fileURL;
                link.setAttribute('download', `${fileInfo.originalName}`);
                document.body.appendChild(link);
                link.click();
                resolve();
            }).catch((e) => {
                reject(e);
            })
        });
    }
}

export default FileService;
