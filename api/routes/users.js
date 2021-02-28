let User = require('../model/user');

// Récupérer un user par son id (GET)
function getUser(req, res){
    let username = req.params.username;

    User.findOne({username: username}, (err, user) =>{
        if(err){res.send(err)}
        res.json(user);
    })
}

// suppression d'un user (DELETE)
function deleteUser(req, res) {

    User.findByIdAndRemove(req.params.username, (err, user) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${user.username} deleted`});
    })
}


module.exports = { getUser, deleteUser };
