/**
 * Upload Service Client
 * Cliente para comunicação com o microsserviço de uploads
 * 
 * Uso:
 * const uploadClient = new UploadClient('http://localhost:3001');
 * 
 * // Upload único
 * const result = await uploadClient.uploadFile(file);
 * 
 * // Upload múltiplo
 * const results = await uploadClient.uploadMultiple(fileArray);
 */

class UploadClient {
    constructor(baseURL = 'http://localhost:3001') {
        this.baseURL = baseURL;
    }

    /**
     * Faz upload de um arquivo único
     * @param {File} file - Arquivo a fazer upload
     * @returns {Promise} Resultado do upload
     */
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${this.baseURL}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Erro ao fazer upload: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro no upload:', error);
            throw error;
        }
    }

    /**
     * Faz upload de múltiplos arquivos
     * @param {FileList|File[]} files - Arquivos a fazer upload
     * @returns {Promise} Resultado do upload
     */
    async uploadMultiple(files) {
        const formData = new FormData();
        
        // Suporta FileList ou Array
        const fileArray = Array.from(files);
        fileArray.forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await fetch(`${this.baseURL}/upload-multiple`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Erro ao fazer upload: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro no upload múltiplo:', error);
            throw error;
        }
    }

    /**
     * Lista todos os arquivos
     * @returns {Promise} Lista de arquivos
     */
    async listFiles() {
        try {
            const response = await fetch(`${this.baseURL}/files`);

            if (!response.ok) {
                throw new Error('Erro ao listar arquivos');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao listar arquivos:', error);
            throw error;
        }
    }

    /**
     * Deleta um arquivo
     * @param {string} filename - Nome do arquivo
     * @returns {Promise} Resultado da operação
     */
    async deleteFile(filename) {
        try {
            const response = await fetch(`${this.baseURL}/files/${filename}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar arquivo');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao deletar arquivo:', error);
            throw error;
        }
    }

    /**
     * Verifica saúde do serviço
     * @returns {Promise} Status do serviço
     */
    async health() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            return await response.json();
        } catch (error) {
            console.error('Serviço indisponível:', error);
            return { status: 'DOWN' };
        }
    }

    /**
     * Download de arquivo
     * @param {string} filename - Nome do arquivo
     */
    downloadFile(filename) {
        window.open(`${this.baseURL}/uploads/${filename}`, '_blank');
    }
}

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UploadClient;
}
