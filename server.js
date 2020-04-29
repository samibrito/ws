// usei oexpress pra criar e configurar meu servidor
const express = require("express")
const server = express()

const db = require("./db")

// consigurar arquivos estáticos (css, scripts, imagem)
server.use(express.static("public"))

// hablitar uso do req.body
server.use(express.urlencoded({ extended: true }))

//configuração do nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
  express: server,
  noCache: true, //boolean
})

// criei uma rota /
// e capturo o pedido do cliente pra responder
server.get("/", function (req, res){
  db.all(`SELECT * FROM ideas`, function(err, rows) {
    if (err) {
      console.log(err)
      return res.send("Erro no banco de dados!")
    }
  
    const reversedIdeas = [...rows].reverse()

    let lastIdeas = []
    for (let idea of reversedIdeas) {
      if(lastIdeas.length < 2) {
        lastIdeas.push(idea)
      }
    }

    return res.render("index.html", { ideas: lastIdeas })
  })
})

server.get("/ideias", function (req, res){
  db.all(`SELECT * FROM ideas`, function(err, rows) {
    if (err) {
      console.log(err)
      return res.send("Erro no banco de dados!")
    }

    const reversedIdeas = [...rows].reverse()
    return res.render("ideias.html", { ideas: reversedIdeas })
  })
})

server.post("/", function (req, res){
  // inserir dados na tabela
  const query = `
  INSERT INTO ideas(
    image,
    title,
    category,
    description,
    link 
  ) VALUES (?,?,?,?,?);    
`
  const values = [
    req.body.image,
    req.body.title,
    req.body.category,
    req.body.description,
    req.body.link

  ]

  db.run(query, values, function(err) {
    if (err) {
      console.log(err)
      return res.send("Erro no banco de dados!")
    }

    return res.redirect("/ideias")

  
  })

})



// server.delete("/ideias", function (req, res){
//   db.run(`DELETE FROM ideas WHERE id = ?`, [req.body.id], function(err) {
//     if (err) {
//       console.log(err)
//       return res.send("Erro no banco de dados!")
//     }

//     return res.redirect("/ideias")
//   })

// })

// server.post("/ideias", function (req, res){
//     const query = 
//     `SELECT
//       image,
//       title,
//       category,
//       description,
//       link 
//       FROM ideas
//       WHERE id = ?
//     `
// const values = [2]

//   db.run(query, values, function(err) {
//     if (err) {
//       console.log(err)
//       return res.send("Erro no banco de dados!")
//     }

//     return res.redirect("/ideias")
//   })

// })

server.get("/ideias/:id", function (req, res){
  db.run(`SELECT * FROM ideas WHERE id = ?`, [req.params.id], function(err, rows) {
    if (err) return console.log(err)

    console.log(rows)
  })
})


// liguei meu servidor na porta 3000
server.listen(3000)