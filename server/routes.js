const SceneModel = require('./models/Scenes')
const { ObjectId } = require("mongodb");
const fs = require("fs");

module.exports = function (app) {

    app.get("/getScenes", (req, res) => {
        SceneModel.find({}, (err, result) => {
            if (err) {
                res.json(err);
            } else {
                res.json(result);
            }
        })
    });

    app.get("/getScenes/:_id", (req, res) => {
        SceneModel.findById(ObjectId(req.params._id), (err, result) => {
            if (err) {
                res.json(err);
            } else {
                const content = fs.readFileSync(result.filePath).toString();
                res.json({ result: result, content: content });
            }
        })
    });

    app.post("/createScene", async (req, res) => {
        let updated = false;
        var newScene;
        const scene = req.body;
        console.log(scene);
        fs.unlink(scene.filePath, function (err) {
            if (err) {
                console.log("file hasn't exists")
            }
            // if no error, file has been deleted successfully
            else {
                console.log('File deleted!');
                SceneModel.find({ filePath: scene.filePath }).remove().then(() => {
                    newScene = new SceneModel(scene);
                    newScene.save();
                    updated = true;
                })
            }
        });
        if (updated === false) {
            newScene = await new SceneModel(scene);
            await newScene.save();
        }
        res.json(newScene);
    });
}