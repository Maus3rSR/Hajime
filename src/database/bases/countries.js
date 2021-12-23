const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

const countries = prisma.countries.createMany({
    data: [
        {
            name: 'France',
            iso: 'fr'
        }
    ]
})