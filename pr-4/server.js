const express = require('express')
const ConnectDb = require('./config/db')
const app = express()
const multer = require('multer')
const BookModel = require('./models/book')
const path = require('path')
const port = 8000
const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config()
//connect db
ConnectDb()
//middlewares
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'uploads')))
app.use(express.json())
//setup ejs
app.set("view engine","ejs")
//multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
        cb(null, filename);
      }
  })
  
  const upload = multer({ storage: storage })
//routes
app.get('/',(req,res)=>{
    res.render('add')
})
app.post('/addbook',upload.single('image'),async(req,res)=>{
    const {bookName,price,author,pages}=req.body
    const image = req.file; // File info
    console.log(image);
    
    if (!bookName || !price || !author || !pages || !image) {
        return res.status(400).send('All fields are required');
      }
      const book = await new BookModel({
        bookName: bookName,
        price: price,
        author: author,
        pages: pages,
        image: image.filename
      })
      await book.save().then((data)=>{
        res.redirect('/view')
        console.log(data);
        
      }).catch((err)=>{
        console.log(err)
      })
})  
app.get('/view',(req,res)=>{
    BookModel.find().then((data)=>{
        res.render('view',{data:data})
        }).catch((err)=>{
            console.log(err)
        })
})
app.get('/deletebook',upload.single('image'),(req,res)=>{
  let id = req.query.id

  BookModel.findById(id).then((data)=>{
    let imagePath = path.join(__dirname, 'uploads', data.image);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Error deleting the image file:', err);
      }
    });
    BookModel.findByIdAndDelete(id).then((data)=>{
      res.redirect('/view')
      }).catch((err)=>{
        console.log(err)
        })

    }).catch((err)=>{
      console.log(err)
    })

})
app.get('/editbook',(req,res)=>{
  let id = req.query.id
  BookModel.findById(id).then((data)=>{
    res.render('edit',{data:data})
  }).catch((err)=>{
    console.log(err)
  })
})
app.post('/updatebook', upload.single('image'), async (req, res) => {
  try {
   const {name,author,price,id,pages} = req.body
        const book = await BookModel.findById(id)
         if(req.file){
            const newimage = req.file.filename
            const oldImagePath = path.join(__dirname,'uploads/',book.image)
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
            book.image = newimage
         }else{
            book.image = book.image
         }
         book.name = name
         book.author = author
         book.price = price
         book.pages = pages

         await book.save()
         res.redirect('/view')
  } catch (error) {
    console.error('Error updating book:', error);
 
  }
});


app.listen(port,(err)=>{
    if(err) console.log(err)
    console.log(`Server Running On The Port = ${port}`);
})
//name,price,author,images,pages