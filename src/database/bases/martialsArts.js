const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

const martialArts = await prisma.martialArts.createMany({
    data: [
        {
            name: 'Kendo'
        },
        {
            name: 'Iaido'
        },
        {
            name: 'Jodo'
        },
        {
            name: 'Chanbara'
        },
        {
            name: 'Naginata'
        }
    ]
})