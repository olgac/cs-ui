const axios = require('axios');

const axiosInstance = axios.create({
  baseURL: 'https://agile-caverns-39115.herokuapp.com',
  timeout: 5000,
  transformResponse: [(data) => {
    if (typeof data === 'string') {
      return JSON.parse(data || '{}');
    }

    return data;
  }]
});

let TOKEN = null;

const getDashboard = () => {
  const options = {
    url: '/transaction/report',
    data: {
      "fromDate": "2015-10-01",
      "toDate": "2015-10-15"
    },
    method: 'post',
    headers: {
      'Authorization': TOKEN,
      'Content-Type': 'application/json'
    }
  };

  return axiosInstance(options);
}

module.exports = (app) => {
  // GET requests.
  app.get('/', (req, res) => {
    res.render('login');
  });

  app.get('/transactions', (req, res) => {
    const options = {
      url: '/transaction/list',
      data: {
        "fromDate": "2015-10-01",
        "toDate": "2015-10-15"
      },
      method: 'post',
      headers: {
        'Authorization': TOKEN,
        'Content-Type': 'application/json'
      }
    };

    axiosInstance(options)
      .then(({ data }) => {
        const transactions = data.data;

        getDashboard()
          .then(({ data }) => {
            res.render('transactions', {
              transactions,
              dashboard: data.response
            });
          })
          .catch(() => {
            res.redirect('/');
          });
      })
      .catch(() => {
        res.redirect('/');
      });
  });

  // POST requests.
  app.post('/api/login', (req, res) => {
    const data = req.body;

    const options = {
      url: '/user/login',
      data,
      method: 'post',
    };

    axiosInstance(options)
      .then(({ data }) => {
        if (data.token) {
          TOKEN = data.token;
          res.json({ token: data.token });
        }
      })
      .catch((response) => {
        res.sendStatus(500);
      });
  });

  app.post('/api/transactions/get-info', (req, res) => {
    const data = req.body;
    let url = null;

    switch (data.type) {
      case 'client':
        url = '/transaction/client';
        break;
      case 'merchant':
        url = '/transaction/merchant';
        break;
      case 'detail':
        url = '/transaction';
        break;
    }

    const options = {
      url,
      data,
      method: 'post',
      headers: {
        'Authorization': TOKEN,
        'Content-Type': 'application/json'
      }
    };

    axiosInstance(options)
      .then(({ data }) => {
        res.json({ data });
      });
  });
}
