var express = require("express"); // Otetaan express käyttöön
var app = express();
app.set("view engine", "ejs"); // Otetaan ejs käyttöön
const PORT = process.env.PORT || 3000; // Määritellään portti

var mongoose = require("mongoose"); // Otetaan mongoose käyttöön tietokantakutsuja varten
var uri = "mongodb+srv://Nelli:Admin1@cluster0.tq8uc.mongodb.net/LeffaAPI";

// Luodaan yhteys tietokantaan
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

// Luodaan malli, jossa tietokannan tieto esiintyy
const Leffa = mongoose.model(
    "Leffa",
    {
        nimi: String,
        ohjaaja: String,
        jvuosi: Number,
        genre: String,
    },
    "Leffat" // Kokoelma, josta tiedot haetaan
);


// Luodaan reitti, joka vie API:n etusivulle
app.get("/", function(request, response) {

    response.render("pages/etusivu");
    console.log("Ladataan etusivu...");

});


// Luodaan reitti, joka tulostaa kaikki tietokannan tiedot
app.get("/api/getall", function(request, response) {
    Leffa.find({}, function(err, results) {

        if(err) {
            console.log(err);
            response.json("Tulostamisessa tapahtui virhe.", 500);

        } else {
            response.json(results, 200);
        }
    });
});


// Luodaan reitti, joka tulostaa id:n perusteella yhden elokuvan
app.get("/api/:id", function(request, response) {

    var id = request.params.id; // Tallennetaan kutsussa määritelty id 

    Leffa.findById(id, function(err, results) {

        if(err) {
            console.log(err);
            response.json("Elokuvan tulostaminen ei onnistunut.", 500);
        } else {
            response.json("Tulostetaan id:llä " + id + " " + results.nimi, 200);
        }
    });
});


// Luodaan reitti, joka lisää uuden dokumentin/elokuvan API:iin
app.post("/api/add", function(request, response) {
    
    Leffa.create({nimi: "Soul", ohjaaja: "Pete Docter", jvuosi: "2020", genre: "Perhe/Seikkailu"}); // Lisää määritellyn elokuvan tietokantaan

    response.json("Lisätty elokuva: Soul!");
});


// Luodaan reitti, joka muokkaa yhtä dokumenttia id:n perusteella
app.put("/api/update/:id", function(request, response) {

    var id = request.params.id;

    Leffa.findByIdAndUpdate(id, {nimi: "Vaihdettu nimi"}, function(err, results) {
        
        if(err) {
            console.log(err);
            response.json("Elokuvan tietojen muuttaminen ei onnistunut.", 500)
        } else {
            response.json("Muutettu id:llä " + id + " elokuva: " + results);
        }
    });
});


// Luodaan reitti, joka poistaa id:n perusteella yhden elokuvan
app.delete("/api/delete/:id", function(request, response) {
    
    var id = request.params.id;

    Leffa.findByIdAndDelete(id, function(err, results) {

        if(err) {
            console.log(err);
            response.json("Elokuvan poistaminen ei onnistunut.", 500);
        } else if(results == null) {
            response.json("Tuloksia ei löytynyt.", 200);
        } else {
            console.log(results);
            response.json("Poistettu id:llä " + id + " " + results.nimi, 200);
        }
    });
});

app.listen(PORT, function() {
    console.log("Kuunnellaan porttia 3000!");
});