var express = require('express');
var router = express.Router();
var multer = require('multer');
var mongoose = require('mongoose');
var fs = require('fs');
var Schema = mongoose.Schema;

const assignmentsSchema = new Schema({
  name: {
    type: String
  },
  enddate: {
    type: String,
  },
  endtime: {
    type: String
  },
  task: {
    data: Buffer,
    contentType: String
  }
});
const Assignment = new mongoose.model('Assignment', assignmentsSchema);

const submissionSchema = new Schema({
  studentname: {
    type: String,
  },
  filename: {
    type: String
  },
  assignment_id: {
    type: mongoose.Types.ObjectId,
    ref: 'Assignment'
  },
  submitted_at: {
    type: Date
  },
  task: {
    data: Buffer,
    contentType: String
  },
  marks: {
    type: String,
    default: 'Not Marked'
  }
})
const Submission = new mongoose.model('Submission', submissionSchema);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: (req, file, cb) => {
    cb(null, 'assignments/' + file.originalname)
  }
})

const upload = multer({ storage: storage }).single('file')

router.post('/upload', upload, (req, res, next) => {
  const date = String(req.body.date)
  const time = String(req.body.time)
  upload(req, res, (err) => {
    if (err) {
      res.sendStatus(500);
    }
  })
  const assignment = new Assignment({
    name: req.file.originalname,
  })
  assignment.enddate = date
  assignment.endtime = time
  assignment.task.data = fs.readFileSync(req.file.path);
  assignment.task.contentType = req.file.mimetype;
  assignment.save((err, rec) => {
    if (err)
      res.json({
        success: false,
        err: err
      })
    else
      res.json({
        success: true,
        data: rec
      })
  })
});

router.get('/getassignments', (req, res) => {
  Assignment.find({}, (err, rec) => {
    if (err)
      res.json({
        success: false,
        err: err.name
      })
    else if (rec.length > 0) {
      res.json({
        success: true,
        rec: rec
      })
    }
    else {
      res.json({
        success: false,
        err: 'No Assignments Found'
      })

    }

  })
})

router.delete('/deleteassignment/:id', (req, res) => {
  Assignment.findByIdAndRemove(req.params.id, (err, data) => {
    if (err)
      res.json({
        success: false,
      })
    else {
      res.json({
        success: true,
        rec: data
      })
    }
  })
})

router.post('/submitassignment', upload, (req, res) => {
  const data = req.body
  upload(req, res, (err) => {
    if (err) {
      res.sendStatus(500);
    }
  })
  const submission = new Submission(data)
  submission.task.data = fs.readFileSync(req.file.path);
  submission.task.contentType = req.file.mimetype;
  submission.save((err, data) => {
    if (err) {
      res.json({
        success: false
      })
    }
    else {
      res.json({
        success: true,
        data: data
      })
    }
  })
})

router.get('/getsubmission/:id', (req, res) => {
  Submission.find({ assignment_id: req.params.id }, (err, rec) => {
    if (err)
      res.json({
        success: false,
        err: err.name
      })
    else if (rec.length > 0) {
      res.json({
        success: true,
        rec: rec
      })
    }
    else {
      res.json({
        success: false,
        err: 'No Data Found'
      })
    }
  })
})

router.patch('/updatemarks', (req, res) => {
  Submission.findById(req.body.id, (err, data) => {
    if (err)
      res.json({
        success: false,
        err: err.name
      })
    else if (data) {
      data.marks = req.body.marks
      data.save((err, data) => {
        if (err)
          res.json({
            success: false,
            err: err.name
          })
        else {
          res.json({
            success: true,
            data: data
          })
        }
      })
    } else {
      res.json({
        success: false,
        err: 'Not Found'
      })
    }
  })
})

module.exports = router;