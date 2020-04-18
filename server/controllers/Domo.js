const makerPage = (req, res) => res.render('app', { csrfToken: req.csrfToken() });

module.exports.makerPage = makerPage;
