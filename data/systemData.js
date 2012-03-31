//data retrieved from server for each system
systemData = {
    star: {
        type: "g",
        size: 300,
        map: "star0"
    },
    planets: [
    {
        name: "SOL1",
        type: "terran",
        distance: 1600,
        size: 175,
        map: "terran0",
        orbit: 0.3,
        moons: [
        {
            distance: 200,
            name: "mooon1",
            type: "barren",
            orbit: 0,
            map: "barren0"
        }
        ]
    },
    {
        name: "SOL2",
        type: "terran",
        distance: 2200,
        size: 80,
        map: "volcanic0",
        orbit:0.5,
        moons: [
    ]
    },
		
    {
        name: "SOL1",
        type: "gasgiant",
        distance: 3400,
        size: 450,
        map: "gas0",
        orbit: 1,
        moons: [
        {
            distance: 200,
            name: "mooon1",
            orbit: 0.36,
            type: "barren",
            map: "barren0"
        },
        {
            distance: 400,
            name: "moon2",
            orbit: 2.0,
            type: "ice",
            map: "barren0"
        },
        {
            distance: 600,
            name: "moon3",
            orbit: .61,
            type: "desert",
            map: "barren0"
        }
        ]
    },
    {
        name: "SOL1",
        type: "gasgiant",
        distance: 4000,
        size: 350,
        map: "gas1",
        orbit: .6,
        moons: [
        {
            distance: 200,
            name: "mooon1",
            orbit:0.36,
            type: "barren",
            map: "barren0"
        },
        {
            distance: 400,
            name: "moon3",
            orbit:1.1,
            type: "desert",
            map: "barren0"
        }
        ]
    }

    ],
    ships:[
    {
        type:"frigate",
        id: 0,
        subtype:"cruiser",
        position:{
            x:2780,
            y:50,
            z:50
        },
        rotation:{
            x:0,
            y:0,
            z:0
        }
    },
    {
        type:"frigate",
        subtype:"cruiser",
        id: 1,
        position:{
            x:2820,
            y:50,
            z:50
        },
        rotation:{
            x:0,
            y:0,
            z:0
        }
    },
    {
        type:"frigate",
        subtype:"cruiser",
        id: 2,
        position:{
            x:2800,
            y:50,
            z:20
        },
        rotation:{
            x:0,
            y:0,
            z:0
        }
    }
    ]
}