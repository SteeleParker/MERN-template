const route = (req, res) => {
	//clear cookies and stored data
	req.session.account = null;
	res.clearCookie('loggedin');
	res.clearCookie('admin');

	return res.status(200).end();
};

module.exports = route;