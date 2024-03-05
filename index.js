// import "dotenv/config";

import express from "express";
import cors from "cors";
import multer from 'multer'
import path from "path";
import fs from "fs/promises";
import { nanoid } from "nanoid";




const app = express();

app.use(cors())
app.use(express.json)
app.use(express.static('public')) //якщо прийде запит на статичний файл, шукай його в папці

const contactsPath = path.join('./load', "books");

const multerConfic = multer.diskStorage({
     destination: contactsPath,
     filename: (req, file, cb) => {
     cb(null, file.originalname)
    }

})

const tempDir = multer({
    storage: multerConfic
})

const books = []

app.get('/api/books', (req, res) => {
    res.json(books)

})

const booksDir = path.join('./public', "books")

app.post('/api/books', tempDir.single("cover"), async(req, res) => {
// console.log(req.body),
// console.log(req.file)

const{path: tempUpload, originalname} = req.file
const resultUpload = path.join(booksDir, originalname)
await fs.rename(tempUpload, resultUpload )
const cover = path.join( 'books', originalname)
const newBook = {
  id:  nanoid(),
  ...req.body,
  cover

}
books.push(newBook)

res.status(201).json(newBook)


})

app.listen(3000)