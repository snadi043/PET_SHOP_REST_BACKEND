exports.getFeed = (req, res, next) => {
    res.status(200).json({
        post: [{
            title: 'new feeds',
            message: 'this is the first feed post',
        }],
    });
}

exports.postFeed = (req, res, next) => {
    const title = req.body.title;
    const message = req.body.message;
    res.status(201).json({
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: new Date.toISOString(),
            title: title,
            message: message,
        }),
    });
}