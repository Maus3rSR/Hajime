<script>
import * as JsPDF from 'jspdf'
import 'jspdf-autotable';
import { mapState, mapGetters, mapActions } from 'vuex'
import PoolList from '@partials/pool/List'
import { start } from 'repl';

const { BrowserWindow } = require('electron').remote

export default {
    components: { PoolList },
    computed: {
        ...mapState('pool', {
            list: state => state.model.pool_list,
            number_of_entry_per_pool: state => state.model.number_of_entry_per_pool
        }),
        ...mapState('competition', {
            competition_type: state => state.model.type,
        }),
        ...mapGetters({
            constant_type_list: "competition/constant_type_list",
            pool_count: 'pool/pool_count'
        }),
        number_of_entry_left() {
            return this.list[this.pool_count-1].length
        },
        is_last_pool_different_size() {
            return this.number_of_entry_per_pool !== this.last_pool_entry_count
        },
        number_of_pool() {
            return this.is_last_pool_different_size ? this.pool_count - 1 : this.pool_count
        },
        entrant_label() {
            return this.competition_type == this.constant_type_list.TEAM ? "équipes" : "combattants"
        }
    },
    methods: {
        // ...mapActions({
        //     GeneratePdf: "pool/GENERATE_PDF"
        // })
        GeneratePdf() {
            let doc = new JsPDF()

            const margingLeftX = 15
            const margingRightX = doc.internal.pageSize.width - margingLeftX
            const margingY = 15
            const autoTableYCompensation = 5
            const margingBetweenEachPoolLine = 10
            const marginBetweenEachPool = 20
            const tableWidth = doc.internal.pageSize.width / 2 - marginBetweenEachPool
            const margingLeftSecondTable = margingRightX - tableWidth

            let startY = 20
            let current_page = doc.internal.getNumberOfPages()
            let config = {
                pageBreak: 'avoid',
                showHead: 'firstPage',
                tableWidth: tableWidth,
                startY: startY,
                margin: { right: margingLeftX, left: margingLeftX, top: margingY + autoTableYCompensation, bottom: margingY + autoTableYCompensation},
                head: [[null, "Nom"]],
                body: []
            }

            this.list.forEach((pool, index) => { // Each pool
                let body = []
                let is_pair = (index+1) % 2 === 0

                if (!is_pair && index > 0)
                    startY = doc.autoTable.previous.finalY + margingBetweenEachPoolLine

                pool.forEach((entry, entry_index) => body.push([(index+1)+"."+(entry_index+1), entry.name])) // Each entry of pool

                config.head[0][0] = "Poule n°"+(index+1)
                config.body = body
                config.startY = startY
                config.margin.right = (is_pair ? margingLeftX : margingLeftSecondTable)
                config.margin.left = (is_pair ? margingLeftSecondTable : margingLeftX)

                doc.autoTable(config)

                const total_page = doc.internal.getNumberOfPages()
                if (current_page < total_page)
                {
                    current_page = total_page
                    startY = doc.autoTable.previous.pageStartY
                }
            })

            const pageCount = doc.internal.getNumberOfPages()
            for (let i = 0; i < pageCount; i++)
            {
                doc.setPage(i)
                const page_info = doc.internal.getCurrentPageInfo()
                doc.text('Liste des poules ('+this.list.length+')', margingLeftX, margingY)
                doc.setFontSize(10)
                doc.text(margingRightX, margingY, page_info.pageNumber + "/" + pageCount)
                doc.setFontSize(14)
            }

            const pdfWindow = new BrowserWindow({
                width: 1024,
                height: 800,
                webPreferences: {
                    plugins: true,
                    webSecurity: false
                }
            })
            pdfWindow.loadURL(doc.output('datauristring'))
        }
    },
    data() {
        return {}
    }
}
</script>

<template>
    <div>
        <div class="toolbar">
            <div class="toolbar__label">
                {{ number_of_pool }} poules de {{ number_of_entry_per_pool }} {{ entrant_label }}
                <template v-if="is_last_pool_different_size">
                    et 1 poule de {{ number_of_entry_left }} {{ entrant_label }}
                </template>
            </div>

            <div class="actions">
                <a href="javascript:void(0);" @click.prevent="GeneratePdf" title="Télécharger le PDF de la liste des poules" class="actions__item zmdi zmdi-collection-pdf"></a>
            </div>
        </div>

        <software-container limit-container="software__footer" element-scroll="poolListViewer">
            <pool-list
                id="poolListViewer"
                :list="list"
            />
        </software-container>
    </div>
</template>
