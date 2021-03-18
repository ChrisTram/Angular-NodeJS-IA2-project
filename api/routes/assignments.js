let Assignment = require('../model/assignment');

// Récupérer tous les assignments (GET)
/*
function getAssignments(req, res){
    Assignment.find((err, assignments) => {
        if(err){
            res.send(err)
        }

        res.send(assignments);
    });
}
*/

// AVEC PAGINATION
function getFinishedAssignments(req, res) {
  var aggregateQuery = Assignment.aggregate([{ $match: { "rendu": true } }]);

  Assignment.aggregatePaginate(

    aggregateQuery,
    {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    },
    (err, assignments) => {
      if (err) {
        res.send(err);
      }

      res.send(assignments);
    }
  );
}

// AVEC PAGINATION
function getUnfinishedAssignments(req, res) {
  var aggregateQuery = Assignment.aggregate([{ $match: { "rendu": false } }]);

  Assignment.aggregatePaginate(

    aggregateQuery,
    {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    },
    (err, assignments) => {
      if (err) {
        res.send(err);
      }

      res.send(assignments);
    }
  );
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res) {
  let assignmentId = req.params.id;

  Assignment.findOne({ id: assignmentId }, (err, assignment) => {
    if (err) { res.send(err) }
    res.json(assignment);
  })
}

// Ajout d'un assignment (POST)
function postAssignment(req, res) {
  let assignment = new Assignment();
  assignment.id = req.body.id;
  assignment.auteur = req.body.auteur;
  assignment.nom = req.body.nom;
  assignment.matiere = req.body.matiere;
  assignment.note = req.body.note;
  assignment.dateDeRendu = req.body.dateDeRendu;
  assignment.remarques = req.body.remarques;
  assignment.rendu = req.body.rendu;
  assignment.image = req.body.image;

  console.log("POST assignment reçu :");
  console.log(assignment)

  assignment.save((err) => {
    if (err) {
      res.send('cant post assignment ', err);
    }
    res.json({ message: `${assignment.nom} saved!` })
  })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
  console.log("UPDATE recu assignment : ");
  console.log(req.body);
  Assignment.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, assignment) => {
    if (err) {
      console.log(err);
      res.send(err)
    } else {
      res.json({ message: 'updated' })
    }

    // console.log('updated ', assignment)
  });

}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {

  Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
    if (err) {
      res.send(err);
    }
    res.json({ message: `${assignment.nom} deleted` });
  })
}



module.exports = { postAssignment, getFinishedAssignments, getUnfinishedAssignments, getAssignment, updateAssignment, deleteAssignment };
