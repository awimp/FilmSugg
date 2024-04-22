require("dotenv").config()
const express = require("express")
const notion = require("./notion")
const { createSuggestion, getTags } = require("./notion")

const app = express()
app.set("views", "./views")
app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true }))

let tags = []
getTags().then(data => {
   tags = data
})
setInterval(async() => {
   tags = await getTags()
}, 1000 * 60 *60)

app.get("/", (req, res) => {
    res.render("index", { tags })
})

app.post('/create-suggestion', async (req, res) => {
   const {title, description, isShow, tagIds = [] } = req.body

   const tags = (Array.isArray(tagIds) ? tagIds : [tagIds]).map(tagId => {
      return { id: tagId }
   })

   await createSuggestion(
      title,
      description,
      isShow !=null,
      tags
      
   ),

   res.redirect("/")
})

app.listen(process.env.PORT)