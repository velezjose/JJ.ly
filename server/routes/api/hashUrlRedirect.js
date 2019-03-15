const Url = require('../../models/Url');
const { isValidUrl } = require('../../utils/validators.js');
const { nextHash } = require('../../utils/nextHash.js');


module.exports = app => {
  app.get('/:hash([0-9]{5})', (req, res, next) => {
    let hash = req.params.hash.toString();

    if (hash === '__webpack_hmr') {
      return next();
    }

    if (!hash) {
      return res.status(400).send({
        success: false,
        message: 'Error: Invalid hash url.'
      });
    }

    Url.find({ hash }, (err, urlRecord) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: 'Error: Server Error.'
        })
      }

      if (urlRecord.length === 0) {
        return res.status(400).send({
          success: false,
          message: `Error: No tiny url associated with /${hash}.`,
        });
      }
      
      const { url } = urlRecord[0];
      res.status(300).redirect(url);
    });
  });

  // Adds a new Url to schema
  app.post('/api/urls', (req, res, next) => {
    // Get the url
    const { body } = req;
    let { url } = body;

    if (!url) {
      return res.status(400).send({
        success: false,
        message: 'Error: URL must not be empty.',
      });
    }

    url = url.toLowerCase();

    if (!isValidUrl(url)) {
      return res.status(400).send({
        success: false,
        message: 'Error: URL must be valid.',
      });
    }


    Url.find({ url }, (err, urls) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: 'Error: Server error.',
        });
      }

      if (urls.length !== 0) {
        return res.status(409).send({
          success: true,
          message: 'Already in database.',
        });
      }

      // Get a new hash value
      let newHash = nextHash(5);

      // Create new UrlModel
      let newUrlModel = new Url();``
      newUrlModel.hash = newHash;
      newUrlModel.url = url;
    
      // save new url
      newUrlModel.save((err) => {
        if (err) {
          return res.status(500).send({
            success: false,
            message: 'Error: Server error.',
          });
        }
    
        return res.status(201).send({
          success: true,
          message: 'New url saved.',
          hash: newHash,
        });
      });
    });

  });

  app.get('/api/urls', (req, res, next) => {
    Url.find({}, (err, urls) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: 'Error: Server error.',
        })
      }

      return res.status(200).send({
        success: true,
        message: 'Query successful.',
        urls
      });
    })
  });

};
