let User = require('../model/user');

// Récupérer un user par son username (GET)
function getUser(req, res){
    let username = req.params.username;

    User.findOne({username: username}, (err, user) =>{
        if(err){res.send(err)}
        res.json(user);
    })
}

function getUsers(req, res) {
    var aggregateQuery = User.aggregate();
    User.aggregatePaginate(
      aggregateQuery,
      {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
      },
      (err, users) => {
        if (err) {
          res.send(err);
        }
  
        res.send(users);
      }
    );
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


module.exports = { getUser, deleteUser, getUsers };
