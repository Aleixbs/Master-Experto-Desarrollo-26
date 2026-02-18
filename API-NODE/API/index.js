const fs = require('fs').promises
const express = require('express')
const cors = require('cors')

const server = express()
server.use(cors())
server.use(express.json())

const getDatabase = async () => {
    const database = await fs.readFile('./../Database/database.json', 'utf-8', (err, data) => {
        return data
    })
    return JSON.parse(database)
}


async function getPlaces (request, response) {
    const database = await getDatabase()

    response.status(200)

    response.json({
        status: 'success',
        resultadosTotal: database.length,
        data: database,
    })

}

async function getLocal (request, response) {
    const database = await getDatabase()

    const id = Number(request.params.id)

    const local = database.find((local) => local.id == id)

    if (local) {
        response.status(200)
        response.json({
            status: 'success',
            data: {
                local: local
            }
        })
    } else {
        response.status(404)
        response.json({
            stauts: 'failed',
            message: 'Invalid ID'
        })
    }
}


async function newPlace (request, response) {
    const database = await getDatabase()

    const nuevoId = database[database.length - 1].id + 1

    const nuevoLocal = {
        id: nuevoId,
        local: request.body.local,
        nombre: request.body.nombre,
        aforo: Number(request.body.aforo),
        longitud: Number(request.body.longitud),
        latitud: Number(request.body.latitud),
    }


    database.push(nuevoLocal)

    await fs.writeFile(
        './../Database/database.json',
        JSON.stringify(database),
        (err) => {
            console.log(err)
        }
    )

    response.status(201)
    response.json({
        status: 'success',
        data: {
            local: nuevoLocal
        }
    })


}


server.get('/api/locales', getPlaces)

server.get('/api/locales/:id', getLocal)

server.post('/api/locales', newPlace)


//console.log(getDatabase().then((database) => console.log(JSON.stringify(database))))


const port = 8000
server.listen(port, () => {
    console.log('Servidor escuchando en el puerto: ' + port)
}) 