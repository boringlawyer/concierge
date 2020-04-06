const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};
const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Both age and name are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => {
    // let ownerAccount = models.Account.AccountModel.findById(newDomo.owner);
    // ownerAccount.numDomos += 1;
    // let saveOwnerPromise = ownerAccount.save();
    models.Account.AccountModel.findById(newDomo.owner, (err, doc) => {
      if (err || !doc) {
        return res.status(400).json({ error: 'An error occurred' });
      }
      const owner = doc;
      owner.numDomos++;
      return owner.save().then(() => res.json({ redirect: '/maker' }));
    });
  });

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      res.status(400).json({ error: 'Domo already exists' });
    }

    res.status(400).json({ error: 'An error occurred' });
  });

  return domoPromise;
};

const getDomos = (req, res) => Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  }

  return res.json({ domos: docs });
});

const editDomo = (req, res) => {
  Domo.DomoModel.findById(req.body._id, (err, doc) => {
    if (err || !doc) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    const modifiedDomo = doc;
    modifiedDomo.name = req.body.name;
    modifiedDomo.age = req.body.age;
    const domoSavePromise = modifiedDomo.save();
    return domoSavePromise.then(() => res.status(201).json({ redirect: 'maker' }));
  });
};

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.make = makeDomo;
module.exports.editDomo = editDomo;
