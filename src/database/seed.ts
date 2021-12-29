// Support modules export
// https://github.com/prisma/prisma/issues/5030#issuecomment-912588323

import type { Prisma } from "@prisma/client"
import PrismaClientPkg from "@prisma/client"
import martialArts from "./datas/martialsArts_and_scores.js"
import countries from "./datas/countries.js"
import formulas from "./datas/formulas.js"

const PrismaClient = PrismaClientPkg.PrismaClient

const prisma = new PrismaClient()

async function main() {

    console.log('Start seeding ................. 🌱 ')
    
    for (const [i, martialArt] of martialArts.items.entries()) {
        const sports = await prisma.martialArts.create({
            data: {
                name: martialArt.name
            }
        })
        console.log('... create art martial : ')
        console.log(sports)
        
        console.log('... create score : ')
        
        for (const score of martialArt.score) {
            const scores = await prisma.scores.create({
                data: {
                    name: score.name,
                    code: score.code,
                    martialArtId: i + 1
                }
            })
            console.log(scores)
            
        }
    }
    
    console.log('... create countries !')
    for (const country of countries.items) {
        const world = await prisma.countries.create({
            data: {
                name: country.name,
                iso: country.code
            }
        })
    }

    console.log('... create formulas :')
    for (const formula of formulas.items) {
        const types = await prisma.formulas.create({
            data: {
                name: formula.name,
                type: formula.type,
                is_qualification: formula.is_qualification
            }
        })
        console.log(types)
    }

    console.log('................. End seeding 👋')
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })