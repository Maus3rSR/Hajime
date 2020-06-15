import * as JsPDF from 'jspdf'
import 'jspdf-autotable'

// const { BrowserWindow } = require('electron').remote

const api = {
    getNewDocument: () => new JsPDF(),
    open: doc => {
        if (undefined === doc.output)
            return

        // Plugins is not loaded in chromium since Electron 3 ...
        // const pdfWindow = new BrowserWindow({ 
        //     width: 1024,
        //     height: 800,
        //     webPreferences: {
        //         plugins: true,
        //         webSecurity: false,
        //         nodeIntegration: true,
        //         webviewTag: true
        //     }
        // })
        
        doc.save()
    }
}

const PdfPlugin = {
    install(Vue) { Vue.pdf = Vue.prototype.$pdf = api }
}

export default PdfPlugin