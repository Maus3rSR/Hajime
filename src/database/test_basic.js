const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

//// Create a fake data for testing
async function main() {

// Basics Settings
// TODO : exports coutries and Martial Arts from ./bases
    console.log('created Martial Arts: ' + martialArts)
    
    const formulas = await prisma.formulas.createMany({
        data: [
            {
                name: 'simple',
                type: 'Single_elimination',
                is_qualification: 'true'
            }
        ]
    })
    console.log('created Formulas:' + formulas)

// create competitions with settings
    const competition = await prisma.competitions.create({
        data: {
            name: 'Le Meilleur de nous deux',
            place: 'Discord What The Fabrik',
            martialArts: {
                connect: { name: 'Kendo' }
            },
            categories: {
                create: {
                    name: '3e Dan - 2022',
                    stages: {
                        create: {
                            number: '1',
                            reversed_marking_board: 'false',
                            formulas: {
                                connectOrCreate: { name: 'simple' }
                            },
                            groups: {
                                create: {
                                    number: '1',
                                    rounds : {
                                        connect: { id: '1' }
                                    }

                                }
                            },
                            rounds: {
                                create: {
                                    group: '1',
                                    number: '1',
                                    // encounters: {
                                    //     create: {
                                    //         fight: {

                                    //         }
                                    //     }
                                    // }
                                }
                            }
                        }
                    } 
                }
            }
        }
    })
    console.log('created one competition:' + competition)

    const encounter = await prisma.encounters.create({
        data: {
            round: '1',
            group: '1',
            team1: '1',
            team2: '2',
            winner: '1',
        }
    })
    console.log('created one encounter:' + encounter)

    const fight = prisma.fights.create({
        data: {
            encounter: '1',
            fighter1: '1',
            fighter2: '2',
        }
    })
    console.log('created one fight:' + fight)

    const scoreFight = prisma.score_fights.create({
        data: {
            fight: '1',
        }
    })
    console.log('created one scoreFight:' + scoreFight)

// create Teams and fighters

    const team1 = await prisma.teams.create({
        data: {
            competition: {
                connect: { id: '1' }
            },
            category: {
                connect: { id: '1' }
            },
            name: 'Première équipe',
            fighters: {
                create: [
                    {
                        name: 'Kevin U.',
                        grade: '3'
                    }
                ]
            }
        }
    })

    const team2 = await prisma.teams.create({
        data: {
            competition: {
                connect: { id: '1' }
            },
            category: {
                connect: { id: '1' }
            },
            name: 'Deuxième équipe',
            fighters: {
                create: [
                    {
                        name: 'Naïm D.',
                        grade: '3'
                    }
                ]
            }
        }
    })
    
}