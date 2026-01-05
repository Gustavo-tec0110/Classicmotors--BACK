const db = require("./src/database/db.js");

db.run("DELETE FROM carros", () => {
    db.run("DELETE FROM sqlite_sequence WHERE name='carros'", () => {
        console.log("Tabela limpa e IDs resetados.");
        db.close();
    });
});