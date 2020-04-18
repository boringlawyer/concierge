const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};


const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: `/${account.isAdmin ? 'admin' : 'maker'}` });
  });
};

const signup = (req, res) => {
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
      isAdmin: req.body.isAdmin,
    };

    const newAccount = new Account.AccountModel(accountData);
    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: `/${newAccount.isAdmin ? 'admin' : 'maker'}` });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username is already in use' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

const getToken = (req, res) => {
  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

const adminPage = (req, res) => {
  res.render('admin');
};

const getUsersAndConversations = (req, res) => {
  const search = {
    isAdmin: false,
  };
  const userPromise = models.Account.AccountModel.find(search, 'username');
  return userPromise.then((accountDocs) => {
    if (!accountDocs) {
      return res.json({ error: 'An error occurred' });
    }
    return Promise.all(accountDocs.map((a) => {
      const convoPromise = models.Conversation.ConversationModel.findByOwner(a._id);
      return convoPromise.then((convoDocs) => {
        if (!convoDocs) {
          return res.json({ error: 'An error occurred' });
        }
        const convos = convoDocs.map((c) => ({
          title: c.title,
          _id: c._id,
        }));
        return convos;
      }).then((convos) => ({
        name: a.username,
        conversations: convos,
      }));
    })).then((promises) => res.json(promises));
  });
};
// , (accountErr, accountDocs) => {
  //   if (accountErr || !accountDocs) {
  //     return res.json({error: 'An error occurred'});
  //   }
  //   return accountDocs.map((a) => {
  //     models.Conversation.ConversationModel.findByOwner(a._id, (convoErr, convoDocs) => {
  //       if (convoErr || !convoDocs) {
  //         return res.json({error: 'An error occurred'});
  //       }

//     )
//   })
// })
//   }
// }

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.adminPage = adminPage;
module.exports.getUsersAndConversations = getUsersAndConversations;
