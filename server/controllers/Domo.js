const makerPage = (req, res) => {
    return res.render('app', { csrfToken: req.csrfToken()});
};

module.exports.makerPage = makerPage;
