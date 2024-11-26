const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride("_method"))
app.use(morgan("dev"))
app.use(express.static('public'));

const Pokemon = require('./models/pokemon.js')

app.get('/', async (req, res) => {
    res.render('index.ejs')
})

app.delete('/pokemons/:pokemonId', async (req, res) => {
    await Pokemon.findByIdAndDelete(req.params.pokemonId)
    res.redirect('/pokemons')
})

app.get('/pokemons/:pokemonId/edit', async (req, res) => {
    const foundPokemon = await Pokemon.findById(req.params.pokemonId)
    res.render('pokemons/edit.ejs', {
        pokemon: foundPokemon,
    })
})

app.get('/pokemons/new', (req, res) => {
    res.render('pokemons/new.ejs')
})

app.get('/pokemons', async (req, res) => {
    const allPokemons = await Pokemon.find()
    res.render('pokemons/index.ejs', {
        pokemons: allPokemons
    })
})

app.put('/pokemons/:pokemonId', async (req, res) => {
    if (req.body.collected === 'on') {
        req.body.collected = true
    } else {
        req.body.collected = false
    }
    await Pokemon.findByIdAndUpdate(req.params.pokemonId, req.body)
    res.redirect(`/pokemons/${req.params.pokemonId}`)
})

app.post('/pokemons', async (req, res) => {
    if (req.body.collected === 'on') {
        req.body.collected = true
    } else {
        req.body.collected = false
    }
    await Pokemon.create(req.body)
    res.redirect('/pokemons')
})

app.get('/pokemons/:pokemonId', async (req, res)=>{
    const foundPokemon = await Pokemon.findById(req.params.pokemonId)
    res.render('pokemons/show.ejs', {pokemon: foundPokemon})
})

app.listen(3003, () => {
    console.log("Listening on port 3003")
})
