const fs = require("fs");

// write list of tags to file.
// OPEN FILES FROM HTML FOLDER ONE AT A TIME
const writeTagsToFile = () => {

    fs.writeFileSync("../tags.txt", "Tags List\n");
    fs.readdir("../data/", function (err, items) {
        // console.log(items);

        items.forEach(i => {
            const data = require("../data/" + i);
            // get block tags
            data.block.forEach(item => {
                item.tags.forEach(tag => {
                    fs.appendFileSync("../tags.txt", JSON.stringify(tag) + "\n");
                })
            });

            data.grouped.forEach(item => {
                item.tags.forEach(tag => {
                    fs.appendFileSync("../tags.txt", JSON.stringify(tag) + "\n");
                });
                item.items.forEach(item => {
                    item.tags.forEach(tag => {
                        fs.appendFileSync("../tags.txt", JSON.stringify(tag) + "\n");
                    });
                })
            })


        });
    });
}