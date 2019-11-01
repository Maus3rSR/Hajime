import * as JsPDF from 'jspdf'
import 'jspdf-autotable'
import PDFWindow from 'electron-pdf-window'

const { BrowserWindow } = require('electron').remote

const api = {
    getNewDocument: () => new JsPDF(),
    open: doc => {
        if (undefined === doc.output)
            return

        const pdfWindow = new BrowserWindow({
            width: 1024,
            height: 800,
            webPreferences: {
                plugins: true,
                webSecurity: false,
                nodeIntegration: true,
                webviewTag: true
            }
        })
        
        doc.save()
    }
}

const PdfPlugin = {
    install(Vue) { Vue.pdf = Vue.prototype.$pdf = api }
}

export default PdfPlugin