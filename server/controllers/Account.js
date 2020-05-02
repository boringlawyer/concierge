const models = require('../models');

const { Account } = models;
// sends user to the login page
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// logouts the user. Destroys the session and sends them to home page
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Validates username and password, creates a session if successful,
// then redirects them to the appropriate page
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

    return res.json({ redirect: `/${account.isAdmin ? 'admin' : 'app'}` });
  });
};

// Validates username and password input, creates an account, then redirects the user
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
      res.json({ redirect: `/${newAccount.isAdmin ? 'admin' : 'app'}` });
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

// Validates the old password, then generates a new salt and hash for the account to use
// based on the new password
const changePassword = (req, res) => {
  const oldPass = `${req.body.oldPass}`;
  const newPass = `${req.body.newPass}`;
  const newPass2 = `${req.body.newPass2}`;
  if (!oldPass || !newPass || !newPass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (newPass !== newPass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }
  const { username } = req.session.account;
  return Account.AccountModel.authenticate(username, oldPass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }
    return Account.AccountModel.generateHash(newPass, (salt, hash) => {
      const modifiedAccount = account;
      modifiedAccount.salt = salt;
      modifiedAccount.password = hash;
      const savePromise = modifiedAccount.save();
      savePromise.then(() => res.status(201).json({ message: 'Password changed successfully' }));
    });
  });
};

// returns the csurf token used for page validation
const getToken = (req, res) => {
  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

// renders the admin page
const adminPage = (req, res) => {
  res.render('admin');
};
// searches for users (not admins), and returns the user data and their conversations
const getUsersAndConversations = (req, res) => {
  // initial search for accounts who are not admins
  const search = {
    isAdmin: false,
  };
  const userPromise = models.Account.AccountModel.find(search, 'username');
  return userPromise.then((accountDocs) => {
    if (!accountDocs) {
      return res.json({ error: 'An error occurred' });
    }
    /* for every account in accountDocs, create a promise that returns an object
    {
      name: (username of the account),
      conversations: (the conversation that account has created)
    }. Promise.all waits for all promises to be resolved
    */
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
      // Once all promises are resolved, return the promises array as json
    })).then((promises) => res.json(promises));
  });
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.changePassword = changePassword;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.adminPage = adminPage;
module.exports.getUsersAndConversations = getUsersAndConversations;
