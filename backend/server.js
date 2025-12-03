const express = require("express");
const PDFDocument = require("pdfkit");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); 

app.post("/pdf", (req, res) => {
    const data = req.body;
    if (!data){
        return res.status(400).send("no hay datos");  
    }

    const doc = new PDFDocument();
    res.setHeader("Content-Disposition", "attachment; filename=puesto.pdf");
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text("Puesto desarrollador", { align: "center" });
    doc.moveDown();

    for (const key in data) { 
        const value = typeof data[key] === "object" 
            ? JSON.stringify(data[key]) 
            : data[key]; 
        doc.fontSize(14).text(key + " : " + value); 
    }
    
    doc.end();
});

app.listen(3000, () => console.log("Server puerto 3000"));